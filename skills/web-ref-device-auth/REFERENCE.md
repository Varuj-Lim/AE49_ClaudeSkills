# Web Device Auth — Reference

Paste-ready skeletons for the pattern in [SKILL.md](SKILL.md). Distilled from a real production app
(Next.js App Router + Firebase). Names are lightly genericized; the mechanics are verbatim.
Read SKILL.md first for *why* each rule exists.

---

## Env + setup

Client (public — safe to ship):

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<the "Web application" OAuth 2.0 client id>
NEXT_PUBLIC_FIREBASE_API_KEY, _AUTH_DOMAIN, _PROJECT_ID, _STORAGE_BUCKET,
  _MESSAGING_SENDER_ID, _APP_ID           # standard Firebase web config
```

Server (secret):

```
FIREBASE_SERVICE_ACCOUNT_KEY=<admin SDK service-account JSON>   # or App Hosting default creds
CRON_SECRET=<random>                                            # guards the idle-cleanup route
```

**Google Cloud Console** (one-time): create an OAuth 2.0 **Web application** client. Add every
origin the app is served from to **Authorized JavaScript origins** (e.g.
`http://localhost:3000`, `https://your-app.hosted.app`). The GIS **token-client** flow uses no
redirect, so **Authorized redirect URIs can stay empty**. Origins live in the Console, not in
the repo — a missing origin is the usual cause of an `origin_mismatch` / silent failure.

---

## `lib/googleIdentity.ts` — GIS loader + access-token request (no Firebase)

```ts
// Why: signInWithPopup(GoogleAuthProvider) ALWAYS creates a Firebase user. To enforce
// "members only, never create an outsider's account", read the verified email via GIS
// first, gate it server-side, and only THEN touch Firebase (custom-token sign-in).

export const GOOGLE_SIGNIN_CANCELLED = "google_signin_cancelled";
const CANCEL_TYPES = new Set(["popup_closed", "popup_closed_by_user", "access_denied", "user_cancel"]);

function makeGoogleError(type?: string): Error {
  const err = new Error(type ? `Google sign-in error: ${type}` : "Google sign-in was cancelled.");
  (err as { code?: string }).code = type && !CANCEL_TYPES.has(type) ? type : GOOGLE_SIGNIN_CANCELLED;
  return err;
}

let gisPromise: Promise<void> | null = null;
export function loadGoogleIdentity(): Promise<void> {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.oauth2) return resolve();
    const fail = () => { gisPromise = null; reject(new Error("Couldn't reach Google sign-in.")); };
    const existing = document.getElementById("google-gsi-script");
    if (existing) { existing.addEventListener("load", () => resolve()); existing.addEventListener("error", fail); return; }
    const s = document.createElement("script");
    s.id = "google-gsi-script"; s.src = "https://accounts.google.com/gsi/client";
    s.async = true; s.defer = true; s.onload = () => resolve(); s.onerror = fail;
    document.head.appendChild(s);
  });
  return gisPromise;
}

export function requestGoogleAccessToken(clientId: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const google = window.google;
    if (!google?.accounts?.oauth2) return reject(new Error("Google sign-in isn't ready yet."));
    let settled = false;
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: (r) => {
        settled = true;
        if (r.error) return reject(makeGoogleError(r.error));
        if (!r.access_token) return reject(new Error("Google didn't return an access token."));
        resolve(r.access_token);
      },
      error_callback: (err) => { if (!settled) reject(makeGoogleError(err?.type)); },
    });
    client.requestAccessToken();
  });
}
```

Minimal `types/google.d.ts` declares `Window.google.accounts.oauth2` (`initTokenClient` →
`{ requestAccessToken() }`, `callback`/`error_callback`, `GoogleTokenResponse`).

---

## `app/api/auth/google-signin/route.ts` — the check-before-create gate

```ts
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

const DENY_MESSAGE = "This email is not authorized to access this app.";   // one message for every deny
const TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const accessToken = body?.accessToken;
    if (typeof accessToken !== "string" || !accessToken.trim())
      return NextResponse.json({ error: "Missing Google credential." }, { status: 400 });

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return NextResponse.json({ error: "Google sign-in isn't configured." }, { status: 500 });

    // 1. Describe the token at Google (proves genuine + carries the verified email). No user created.
    let info: { aud?: string; azp?: string; email?: string; email_verified?: string | boolean; verified_email?: string | boolean };
    try {
      const resp = await fetch(`${TOKENINFO_URL}?access_token=${encodeURIComponent(accessToken)}`);
      if (!resp.ok) return NextResponse.json({ error: "Google sign-in could not be verified." }, { status: 401 });
      info = await resp.json();
    } catch { return NextResponse.json({ error: "Google sign-in could not be verified." }, { status: 401 }); }

    // 2. Audience: token must have been minted for OUR client id (blocks replay from another app).
    if (info.aud !== clientId && info.azp !== clientId)
      return NextResponse.json({ error: "Google sign-in could not be verified." }, { status: 401 });

    // 3. Verified email (tokeninfo returns the string "true"; older uses boolean verified_email).
    const emailVerified = info.email_verified === "true" || info.email_verified === true
      || info.verified_email === "true" || info.verified_email === true;
    if (!info.email || !emailVerified)
      return NextResponse.json({ error: "Your Google account's email isn't verified." }, { status: 403 });

    // 4. Membership: email must be a member allowed to log in. (Admin SDK bypasses rules;
    //    stored emails may not be lowercased, so scan + compare normalized.)
    const target = info.email.trim().toLowerCase();
    const snap = await adminDb.collection("users").get();
    const match = snap.docs.find((d) => ((d.data().email as string | undefined) ?? "").trim().toLowerCase() === target);
    if (!match) return NextResponse.json({ error: DENY_MESSAGE }, { status: 403 });
    const rec = match.data();
    if (rec.hasLogin === false || rec.status === "inactive")
      return NextResponse.json({ error: DENY_MESSAGE }, { status: 403 });

    // 5. Mint a custom token for the person's REAL uid (the doc id IS the uid).
    const customToken = await adminAuth.createCustomToken(match.id);
    return NextResponse.json({ customToken });
  } catch (e) {
    console.error("google-signin error:", e);
    return NextResponse.json({ error: "Google sign-in failed." }, { status: 500 });
  }
}
```

---

## `context/AuthContext.tsx` — the shared login tail + the observer

```ts
// Module flag: suppress the observer's device check while a login is mid-write.
let loginInProgress = false;

const login = async (email: string, password: string, addDevice = false) => {
  loginInProgress = true;
  try {
    await setPersistence(auth, addDevice ? browserLocalPersistence : browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
    if (addDevice) {
      try { await registerThisDevice(auth.currentUser?.uid ?? ""); }
      catch (err) { await signOut(auth); throw err; }   // no persistent session without a device doc
    } else { await clearStaleRegistration(); }
  } finally { loginInProgress = false; }
};

const loginWithGoogle = async (addDevice = false) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Google sign-in isn't configured.");
  await loadGoogleIdentity();
  const accessToken = await requestGoogleAccessToken(clientId);
  const res = await fetch("/api/auth/google-signin", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ accessToken }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Google sign-in failed.");
  const { customToken } = await res.json();

  loginInProgress = true;                               // from here, identical to password login
  try {
    await setPersistence(auth, addDevice ? browserLocalPersistence : browserSessionPersistence);
    await signInWithCustomToken(auth, customToken);
    if (addDevice) {
      try { await registerThisDevice(auth.currentUser?.uid ?? ""); }
      catch (err) { await signOut(auth); throw err; }
    } else { await clearStaleRegistration(); }
  } finally { loginInProgress = false; }
};

const logout = async () => { await clearStaleRegistration(); await signOut(auth); }; // delete doc BEFORE signOut

// Observer: re-validate this browser's device on every auth resolve.
onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser && getStoredDeviceId() && !loginInProgress) {
    try {
      if (!(await isThisDeviceStillRegistered())) {    // clean not-found ⇒ revoked
        clearStoredDeviceId(); await signOut(auth); /* setUser(null) */ return;
      }
    } catch { /* offline — fail OPEN, stay signed in */ }
  }
  /* loadProfile + setUser(firebaseUser) */
});
```

---

## `lib/deviceIdentity.ts` — the browser's device id (no firebase)

```ts
export const DEVICE_ID_KEY = "app_device_id";   // prefix per app

export const getStoredDeviceId = () => { try { return localStorage.getItem(DEVICE_ID_KEY); } catch { return null; } };
export const storeDeviceId = (id: string) => { try { localStorage.setItem(DEVICE_ID_KEY, id); } catch {} };
export const clearStoredDeviceId = () => { try { localStorage.removeItem(DEVICE_ID_KEY); } catch {} };

// crypto.randomUUID needs a secure context (a LAN http origin isn't) — fall back to a manual v4.
export function generateDeviceId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}

// "Chrome on Windows". Order matters: Edg before Chrome, iPhone before Mac, Android before Linux.
export function parseUserAgentLabel(ua: string): string {
  const browser = ua.includes("Edg/") ? "Edge" : ua.includes("OPR/") || ua.includes("Opera") ? "Opera"
    : ua.includes("Chrome/") ? "Chrome" : ua.includes("Firefox/") ? "Firefox" : ua.includes("Safari/") ? "Safari" : "Browser";
  const os = /iPhone|iPad|iPod/.test(ua) ? "iOS" : ua.includes("Android") ? "Android" : ua.includes("Windows") ? "Windows"
    : ua.includes("Mac OS X") ? "Mac" : ua.includes("Linux") ? "Linux" : "Unknown OS";
  return `${browser} on ${os}`;
}
export const deviceIdSuffix = (id: string) => id.slice(-4).toUpperCase();  // disambiguates same-UA rows
```

---

## `lib/services/deviceService.ts` — register / heartbeat / list / remove

```ts
const COLLECTION = "registeredDevices";

export async function registerThisDevice(uid: string): Promise<void> {
  const now = new Date().toISOString();
  const write = async (id: string) => {
    await setDoc(doc(db, COLLECTION, id), {
      userId: uid,
      label: `${parseUserAgentLabel(navigator.userAgent)} · ${deviceIdSuffix(id)}`,
      createdAt: now, lastActiveAt: now,
    });
    storeDeviceId(id);          // store the id ONLY after the write succeeds
    recordDeviceIp(id);         // fire-and-forget audit — never blocks login
  };
  const existing = getStoredDeviceId();
  const id = existing ?? generateDeviceId();
  try { await write(id); }
  catch (err) {
    // A stored id owned by a DIFFERENT user can't be overwritten (rules freeze userId).
    if (existing && (err as { code?: string }).code === "permission-denied") {
      clearStoredDeviceId(); await write(generateDeviceId());
    } else throw err;
  }
}

export async function clearStaleRegistration(): Promise<void> {
  const id = getStoredDeviceId();
  if (!id) return;
  try { await deleteDoc(doc(db, COLLECTION, id)); } catch { /* idle cron collects it */ }
  clearStoredDeviceId();
}

export async function isThisDeviceStillRegistered(): Promise<boolean> {
  const id = getStoredDeviceId();
  if (!id) return false;
  const snap = await getDoc(doc(db, COLLECTION, id));   // throws offline → caller fails open
  return snap.exists();
}

// Heartbeat: updateDoc ONLY (setDoc would resurrect a doc an admin just removed).
export async function touchThisDevice(): Promise<"ok" | "removed"> {
  const id = getStoredDeviceId();
  if (!id) return "ok";
  try { await updateDoc(doc(db, COLLECTION, id), { lastActiveAt: new Date().toISOString() }); return "ok"; }
  catch {
    try { const snap = await getDoc(doc(db, COLLECTION, id)); return snap.exists() ? "ok" : "removed"; }
    catch { return "ok"; }   // offline — keep the session
  }
}

export async function getMyDevices(uid: string) {   // My Devices card
  const snap = await getDocs(query(collection(db, COLLECTION), where("userId", "==", uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.lastActiveAt ?? "").localeCompare(a.lastActiveAt ?? ""));
}
export async function getAllDevices() {              // admin page (rules gate list to admins)
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function removeDevice(id: string) { await deleteDoc(doc(db, COLLECTION, id)); }
```

`recordDeviceIp(id)` POSTs `{ deviceId }` (with the caller's ID token) to an Admin-SDK route
that writes `ipAddress` — audit only, best-effort, swallows all errors.

---

## `lib/hooks/useDeviceHeartbeat.ts` — liveness + auto sign-out

```ts
export function useDeviceHeartbeat(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const beat = async () => {
      const result = await touchThisDevice();
      if (cancelled || result !== "removed") return;
      clearStoredDeviceId(); await signOut(auth);
    };
    beat();
    const interval = setInterval(beat, DEVICE_HEARTBEAT_MS);
    const onVisible = () => { if (document.visibilityState === "visible") beat(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { cancelled = true; clearInterval(interval); document.removeEventListener("visibilitychange", onVisible); };
  }, [active]);
}
// Mount once in the app shell: useDeviceHeartbeat(!loading && !!user);
```

---

## `types/registeredDevice.ts`

```ts
export interface RegisteredDevice {
  id: string; userId: string; label: string;
  createdAt: string; lastActiveAt: string; ipAddress?: string;
}
export const DEVICE_IDLE_DAYS = 15;
export const DEVICE_HEARTBEAT_MS = 4 * 60_000;
export const DEVICE_IN_USE_WINDOW_MS = 5 * 60_000;
```

---

## Login form — the shared checkbox (JSX)

```tsx
const [addDevice, setAddDevice] = useState(false);
// handleEmailLogin  → login(email, password, addDevice)
// handleGoogleLogin → loginWithGoogle(addDevice)   // swallow GOOGLE_SIGNIN_CANCELLED silently

<label className="flex items-center gap-2 ...">
  <input type="checkbox" checked={addDevice} onChange={(e) => setAddDevice(e.target.checked)} />
  Add this device
</label>
{addDevice && (
  <p className="...">Registers this device and keeps you signed in until it's removed or unused for 15 days. Use only on your personal device.</p>
)}
```

Success UX is **implicit** — no toast. The button reads "Signing in…", the page redirects on
`user` becoming set, and the newly-registered browser then shows in **My Devices** with a
"This device" badge.

---

## `firestore.rules` — `registeredDevices` block

```
match /registeredDevices/{id} {
  allow get: if isSignedIn()
    && (resource == null || resource.data.userId == request.auth.uid || isAdmin());  // null ⇒ revoked reads not-found
  allow list: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
  allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
  allow update: if isSignedIn()
    && resource.data.userId == request.auth.uid
    && request.resource.data.userId == resource.data.userId;    // userId frozen
  allow delete: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
}
```

Replace `isAdmin()` with the app's own privileged-role predicate.

---

## Idle-cleanup cron (optional but recommended)

A `CRON_SECRET`-guarded route (daily) deletes `registeredDevices` where
`lastActiveAt < now − DEVICE_IDLE_DAYS`, batched. Without it, abandoned devices linger as
valid trusted sessions. In <hubname> it runs at 04:00 local via a scheduled function hitting
`/api/cron/device-cleanup`.

---

## <hubname> source file index (provenance)

Single-app origin — this skill is distilled from a single real app only, so treat these
paths as the one source of truth and re-sync against them if it drifts:

| Piece | Path |
|---|---|
| Login checkbox + Google button | `app/login/page.tsx` |
| `login` / `loginWithGoogle` / observer | `context/AuthContext.tsx` |
| GIS loader + token request | `lib/googleIdentity.ts` |
| Check-before-create gate | `app/api/auth/google-signin/route.ts` |
| register / heartbeat / list / remove | `lib/services/deviceService.ts` |
| Device id + UA label | `lib/deviceIdentity.ts` |
| Heartbeat hook | `lib/hooks/useDeviceHeartbeat.ts` |
| Model + constants | `types/registeredDevice.ts` |
| GIS typings | `types/google.d.ts` |
| Firestore rules | `firestore.rules` (`registeredDevices` block) |
| IP audit route | `app/api/device/record-ip/route.ts` |
| Idle-cleanup cron | `app/api/cron/device-cleanup/route.ts` |
| My Devices card (owner) | `components/settings/MyDevicesCard.tsx` |
| All-devices page (admin) | `app/(app)/employees/devices/page.tsx` |
```
