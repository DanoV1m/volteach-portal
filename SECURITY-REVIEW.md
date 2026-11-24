# Security remediation — review only

This branch is not a production deployment. Do not open a pull request targeting main until the existing live-deployment workflow is disabled or its execution is otherwise safely blocked. Do not merge or deploy until all acceptance checks and owner approvals are complete.

## First containment changes

- Remove scheduled Firestore export to GitHub and remove its write permission.
- Require explicit local export to a directory outside the checkout, disallow CI, and avoid logging credentials.
- Remove PR-triggered production deployment and the frontend Gemini build secret.
- Build only frontend assets for Firebase Hosting (do not publish the server bundle or source maps from the Express build).
- Preserve existing registry header files; do not populate them with real data.

## Outstanding incident-response actions (owner approval required)

- Disable the existing database sync and live-deploy workflows on the default branch through GitHub Actions settings before opening a PR. The default branch is unchanged by this proposal.
- Review the history of admin_database and prior workflow logs privately for possible personal-data exposure. The current registry files contained headers only at the review baseline.
- If a Gemini key was accessible in Firestore or browser bundles, revoke/rotate it using the provider console; inspect usage/billing. Never paste credentials into GitHub or chat.
- Migrate Gemini calls to an authenticated, rate-limited server endpoint; remove client-side key loading, deny client reads of secret config, and configure a real backend route for static Firebase Hosting. Validate the migration in staging before deploying rules and frontend together.
- Review Firebase rules, public community resource data, account privileges, OAuth state and retention policy.
- Add isolated CI checks that cannot deploy and verify tests on a non-production branch.

## Acceptance checks

- No scheduled or manual workflow uploads user-level CSVs.
- Export refuses CI, missing output path, and any output directory inside this checkout.
- No Gemini key is passed to frontend builds.
- PR events cannot deploy to production.
- Verify Firebase Hosting output, existing test suite, and manual authenticated workflows before any approved release.
- No production data, credentials, environment configuration or deployed rules have been changed by this branch.
