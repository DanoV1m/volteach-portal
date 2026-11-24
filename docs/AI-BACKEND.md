# AI backend migration (not deployed)

Run the Express backend with Firebase Admin credentials and server-side GEMINI_API_KEY. Browser requests now require Firebase ID tokens. The per-process limit is 20 requests per minute per authenticated UID; this is not a distributed quota. Static Firebase Hosting still needs a same-origin /api/gemini rewrite to an approved backend service before deployment. No backend service has been provisioned. Do not deploy the frontend/rules independently of the validated backend. Rotate previously exposed keys, verify auth and rejection paths, review privacy of prompts, and use distributed quotas before public release.

The authentication/quota/input guard is now isolated and unit-tested with simulated tokens and a deterministic clock. These tests do not validate real Firebase credentials, deployed rules, multi-instance rate limits or production routing.

Firestore permission checks run only against the demo-project emulator. No production rule deployment or service provisioning is performed. Before release, explicitly review compatibility with existing profiles and community records.

## Release gate and runtime test
The proposed Hosting workflow is manual-only and requires main plus explicit DEPLOY confirmation. Do not invoke it until a separately approved backend and rules rollout is ready. The old workflow on main is unchanged; disable it before opening a PR. CI launches the built server locally with all npm dependencies installed, checks the SPA and verifies unauthenticated AI requests and unknown API paths fail safely. The runtime requires firebase-admin (currently a devDependency); use a full npm ci for this candidate, not npm ci --omit=dev. Production dependency packaging and backend provisioning remain release prerequisites.
