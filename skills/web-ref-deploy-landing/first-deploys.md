# First deploys: secrets, extensions and cross-service rules

Read when a hub deploys one of these for the first time. The project's `CLAUDE.md` keeps only its project id, account, mail
address and any live link. Secret values follow `SKILL.md` §3b.

## Secret before push (seen in AE49_Hub and NURI_Hub)

Create the Secret Manager secret and grant access BEFORE the push whose `apphosting.yaml` names it. Otherwise the rollout fails.

## `firestore-send-email` extension

- **Order:** deploy rules and the extension, then prove it with a console test document in `mail` showing
  `delivery.state: SUCCESS`, and only then push the code that writes mail. A `mail` document written before the extension
  exists is never sent, because the extension triggers on create only.
- **Blaze plan** is required. The deploy asks to enable APIs: answer **Y**.
- **Password:** `extensions/firestore-send-email.env` carries a resource PATH, committed on purpose:
  `SMTP_PASSWORD=projects/${param:PROJECT_NUMBER}/secrets/ext-firestore-send-email-SMTP_PASSWORD/versions/latest`.
  Create the secret on the Secret Manager page (§3b) before the first deploy. This order has not been tried on a first install; if
  the CLI still asks, stop and do not type the value there. Without this line the instance
  is created with no password and mail fails with `Missing credentials for "PLAIN"`.
- **New value:** add a version on the web page, then `deploy --only extensions`. A wrong value shows as Gmail
  `535-5.7.8 … not accepted`.
- **First-install service-agent or Eventarc error:** wait about 5 minutes and run the same line again.
- The console then lists one more function, `ext-firestore-send-email-processQueue`.

## `storage.rules` that read Firestore

A rule using `firestore.exists()` is cross-service. The first deploy asks "Cloud Storage for Firebase needs an IAM Role to use
cross-service rules. Grant the new role?": the owner answers **Y**, or every upload is denied in production.

No prompt and no `[rules] Error checking or updating …` warning means the role is already granted. A re-run does not ask again,
because an unchanged ruleset reads "already up to date". To fix a missed grant, in Google Cloud IAM grant
`roles/firebaserules.firestoreServiceAgent` to `service-<project-number>@gcp-sa-firebasestorage.iam.gserviceaccount.com`.

## Functions

Deploy functions after the App Hosting backend exists, when they need its address.

## Reading it back

- **Rules:** after a deploy, confirm the live ruleset holds the change, not only that the command said `Deploy complete!`.
- **Indexes:** the emulator does not enforce them, so a missing one shows only in production.
