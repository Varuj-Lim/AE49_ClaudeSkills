---
name: web-ref-device-auth
description: >-
  The trusted-device sign-in pattern — an "Add this device" checkbox on the
  login form that registers this browser as a remembered, remotely-revocable
  device (a `registeredDevices` Firestore doc + `browserLocalPersistence`), kept
  alive by a heartbeat that signs the browser out when the device is revoked or
  idle 15 days. Paired with a "check-before-create" Google sign-in via Google
  Identity Services (membership-gated, no auto-created accounts, custom-token).
  Distilled from a real Next.js + Firebase app. Use whenever building,
  reviewing, or porting device-trust / remembered-device / stay-signed-in
  registration, a My Devices list, remote device revocation, an idle-device
  cleanup cron, or a membership-gated Google sign-in that must not auto-create
  accounts. Trigger even when the request only says "add this device", "remember
  this device", "trusted devices", "stay signed in", "sign in with Google", "sign
  out other devices", or "device management".
---

# Web Device Auth — trusted device + membership-gated Google sign-in

## Why this exists

Two auth problems, solved together:

1. **Stay signed in, but per-device revocable and auditable.** "Remember me" that's just a
   long-lived cookie can't be *listed* or *revoked* per device. This registers each trusted
   browser as its own Firestore doc, so a user (or an admin) can see every device and sign a
   specific one out — and idle devices expire on their own.
2. **Google sign-in for a *closed membership*, without auto-creating outsiders.** Firebase's
   `signInWithPopup(GoogleAuthProvider)` **always creates a Firebase user** the instant a
   Google account is chosen — an outsider leaves a real orphan account. This reads the
   verified email *first*, gates it server-side, and only then signs in — so a non-member
   leaves **zero trace**.

Distilled from one real production app. [REFERENCE.md](REFERENCE.md) has paste-ready
skeletons + the source file index.

## The two halves

```
LOGIN FORM                          the "Add this device" checkbox governs BOTH paths
├─ [ Sign in ]  (email+password) ─┐
├─ [ Sign in with Google ]  ──────┤   Part A: Google sign-in (check-before-create)
│                                 │      GIS token → server gate → custom token
└─ ☐ Add this device  ────────────┘
                                  ▼
   Part B: device tail (identical on both paths)
   ticked  ⇒ browserLocalPersistence + registerThisDevice(uid)   → registeredDevices doc
   unticked⇒ browserSessionPersistence + clearStaleRegistration()
```

## Part A — Google sign-in (check-before-create)

Do **not** use `signInWithPopup`. Instead:

1. **Client** loads **Google Identity Services** (`https://accounts.google.com/gsi/client`)
   and calls `google.accounts.oauth2.initTokenClient({ scope: "openid email profile" })`
   → `requestAccessToken()`. This returns a Google **access token** — *no* Firebase user.
2. **Client** POSTs the access token to a server route (`/api/auth/google-signin`).
3. **Server** describes the token at Google's `tokeninfo` endpoint and checks three things:
   **audience** (`aud`/`azp` === our client id), **verified email**, and **membership** (the
   email exists in the `users` collection, is active, and may log in). All denies return one
   generic message that never reveals whether the email exists.
4. **Server** mints a Firebase **custom token** for that person's real uid
   (`adminAuth.createCustomToken(uid)`) and returns it.
5. **Client** calls `signInWithCustomToken(auth, customToken)` → from here it's identical to
   password login, so the device tail (Part B) is shared.

## Part B — Add this device (trusted-device registration)

- The login form has one **checkbox** ("Add this device"), shared by both sign-in buttons.
- **Ticked** → `setPersistence(browserLocalPersistence)` (survives browser restart) **and**
  `registerThisDevice(uid)` writes a `registeredDevices/{deviceId}` doc. If that write throws,
  the sign-in is rolled back (`signOut` + rethrow) — no persistent session without a device doc.
- **Unticked** → `setPersistence(browserSessionPersistence)` (this tab only) +
  `clearStaleRegistration()` (drop any previous registration).
- **Device id** = a UUID in `localStorage` (`generateDeviceId`, with a non-secure-context
  fallback), reused across re-logins so one browser keeps one doc; it *is* the Firestore doc id.
- **Heartbeat** (`useDeviceHeartbeat`, mounted in the app shell): bumps `lastActiveAt`
  immediately, every 4 min, and on tab refocus. A `"removed"` beat (doc gone) signs the
  browser out.
- **Revocation** comes from three places — the owner's **My Devices** card, an admin
  **all-devices** page, and a daily **idle-cleanup cron** (removes devices idle > 15 days).
- The auth observer (`onAuthStateChanged`) re-checks registration on every resolve; signs out if the doc is gone.

## Data model

```ts
interface RegisteredDevice {
  id: string;           // = the localStorage device UUID (the doc id)
  userId: string;       // owner's Firebase Auth uid — FROZEN by rules after create
  label: string;        // "Chrome on Windows · A1B2" (UA parse + id suffix)
  createdAt: string;    // ISO
  lastActiveAt: string; // ISO — bumped by the heartbeat
  ipAddress?: string;   // audit only; NOT a uniqueness signal (office NAT shares one)
}
const DEVICE_IDLE_DAYS = 15;          // idle-cleanup cutoff
const DEVICE_HEARTBEAT_MS = 4*60_000; // heartbeat interval
const DEVICE_IN_USE_WINDOW_MS = 5*60_000; // "In use" vs "Idle" pill threshold
```

Collection `registeredDevices`, one doc per device. Lifecycle: **register** (login, ticked)
→ **heartbeat** bumps `lastActiveAt` (every 4 min + on refocus + on auth resolve) →
**revoked** (owner card / admin page / idle cron deletes the doc) → next beat reads doc gone
⇒ clear local id + `signOut`.

## Correctness rules (what makes it safe)

- **Fail OPEN on network error.** A registration re-check that *throws* (offline, flaky link)
  keeps the user signed in — never lock someone out on a bad connection. Only a clean
  `exists:false` signs them out.
- **`loginInProgress` guard.** A module flag suppresses the auth observer's device check while
  `login`/`loginWithGoogle` are mid-write — otherwise the observer races the not-yet-written doc.
- **Store the local id ONLY after the write succeeds** — a failed registration leaves no
  dangling `localStorage` key.
- **`userId` is frozen by rules on update**; a stale id owned by a *different* user hits
  permission-denied → mint a fresh UUID and retry once.
- **Heartbeat uses `updateDoc`, never `setDoc`** — a `setDoc` would *resurrect* a doc an admin
  just deleted.
- **The `get` rule allows `resource == null`** so a revoked device reads *not-found* instead of
  *permission-denied* (clean sign-out, no error spam).

**Firestore rules:** `registeredDevices` is owner-scoped (create/update/delete only your own,
`userId` frozen on update); an admin role may `list`/`delete` any. Full block in
[REFERENCE.md](REFERENCE.md).

## Porting to a new project

**Keep:** the anatomy, the `RegisteredDevice` model, the lifecycle, and every correctness rule
above — they're what make it safe.

**Swap per project:**
- **Brand** — checkbox/button styling, the "This device" badge, the In-use/Idle pill colors.
- **The membership predicate** — how the server decides "is this a real member who may log in".
- **Open sign-up?** If your app *should* create a user on first Google login, drop the
  check-before-create gate and use plain `signInWithPopup(GoogleAuthProvider)` +
  create-user-on-first-login. **The device tail (Part B) attaches unchanged** either way.

## Don't

- ❌ Don't `setDoc` in the heartbeat (resurrects revoked devices).
- ❌ Don't lock the user out when a re-check throws (offline ≠ revoked).
- ❌ Don't treat `ipAddress` as a uniqueness/identity signal — it's audit-only.
- ❌ Don't use `signInWithPopup` for a *closed* membership — it creates the outsider's account.
- ❌ Don't skip the `loginInProgress` guard — the observer will race the device write.

## Reference

Paste-ready skeletons, env + Google-Console setup, Firestore rules, <hubname> file index → [REFERENCE.md](REFERENCE.md).
