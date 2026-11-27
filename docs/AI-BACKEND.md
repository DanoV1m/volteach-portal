# AI backend migration (not deployed)

Run the Express backend with Firebase Admin credentials and server-side GEMINI_API_KEY. Browser requests now require Firebase ID tokens. The per-process limit is 20 requests per minute per authenticated UID; this is not a distributed quota. Static Firebase Hosting still needs a same-origin /api/gemini rewrite to an approved backend service before deployment. No backend service has been provisioned. Do not deploy the frontend/rules independently of the validated backend. Rotate previously exposed keys, verify auth and rejection paths, review privacy of prompts, and use distributed quotas before public release.

The authentication/quota/input guard is now isolated and unit-tested with simulated tokens and a deterministic clock. These tests do not validate real Firebase credentials, deployed rules, multi-instance rate limits or production routing.

Firestore permission checks run only against the demo-project emulator. No production rule deployment or service provisioning is performed. Before release, explicitly review compatibility with existing profiles and community records.

## Release gate and runtime test
The proposed Hosting workflow is manual-only and requires main plus explicit DEPLOY confirmation. Do not invoke it until a separately approved backend and rules rollout is ready. The old workflow on main is unchanged; disable it before opening a PR. CI launches the built server locally with all npm dependencies installed, checks the SPA and verifies unauthenticated AI requests and unknown API paths fail safely. The runtime requires firebase-admin (currently a devDependency); use a full npm ci for this candidate, not npm ci --omit=dev. Production dependency packaging and backend provisioning remain release prerequisites.

## Excellence Board follow-up
Candidate checks revoked tokens using Firebase Admin, adds a per-process global quota (120/minute in addition to 20/minute per UID), avoids logging user-supplied URL paths in telemetry, and disables the Express identification header. These are not distributed quotas or live validation. No key has been rotated and no deployment performed. Do not open a PR against main while its legacy live deployment workflow is enabled. Obtain separate approval to disable that workflow, review the proposed rules and backend together, and rotate credentials through the provider console without pasting them into the repository.

## V2.0 follow-up — local guard verification
Seven independent Node 22 tests passed on the exact guard blob 053a8a7c03ebd28e7c51b2483d7cc07849f9bdb9 (Git hash verified): missing/malformed/simulated revoked tokens, invalid inputs, per-user quota/reset, aggregate quota, concurrent requests, identity capacity/expiry, and invalid quota configuration. Equivalent additional Vitest regressions are included. This does not verify real token revocation, deployed rules, live provider calls or the complete application build.

### Release decision checklist (not executed)
1. Owner explicitly authorizes disabling the legacy automatic live Hosting workflow on main, through GitHub's workflow controls. Confirm disabled state before opening a PR; do not dispatch any deployment.
2. Verify security-branch CI, emulator-only permission checks and production-bundle local smoke test. Inspect all other deployment workflows and provider integrations.
3. Plan an approved coordinated backend/rules/frontend rollout with server-side secret storage, distributed quotas, monitoring and rollback. Rotate any previously client-accessible Gemini key through the provider console; never include its value in commits or reports.
4. Validate real revoked tokens, same-origin API routing, server credentials and least privilege in a separately authorized nonproduction environment. Do not release until all gates are met.
