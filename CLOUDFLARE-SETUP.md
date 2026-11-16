# Cloudflare Worker + private R2 setup

## Important status
This package contains the bilingual website and a **backend scaffold**. It is not ready for real participant submissions. The front-end now has a Turnstile-protected upload path wired to this API. However, submissions remain disabled by configuration, and the release, privacy notice, IADT rights position, email/PDF workflow and retention/deletion procedures are not yet complete. The Worker refuses uploads until security settings are completed and submissions are explicitly enabled.

Do not collect real participant data until the release, privacy notice, IADT rights position, retention/deletion process and email delivery have been finalised and reviewed.

## Repository layout
Keep the existing website files in the repository root. Add these new backend files:
- `wrangler.toml`
- `src/index.js`
- `CLOUDFLARE-SETUP.md`

The root `index.html` remains the GitHub Pages homepage. The Worker is deployed separately from the same GitHub repository by the Cloudflare Worker project.

## Cloudflare project screen
- Project name: `sundayatchurch-api`
- Build command: leave empty
- Deploy command: `npx wrangler deploy`
- Preview command: leave default
- Protect with Cloudflare Access: off
- Do not create an API token in the project setup screen.

## After the repository is updated
1. Deploy the Worker once with `ENABLE_SUBMISSIONS = "false"`.
2. In Worker settings, confirm the R2 binding named `BUCKET` points to bucket `sundayatchurch` (the wrangler.toml should create/configure this binding).
3. Add a Worker secret named `TURNSTILE_SECRET_KEY` only after creating a Cloudflare Turnstile widget for the website. Keep the secret in Cloudflare, never in GitHub.
4. The front-end now includes the Turnstile widget using the public Site Key. The Secret Key must remain a Worker Secret named `TURNSTILE_SECRET_KEY`.
5. Keep `ENABLE_SUBMISSIONS` set to `false` until the front-end upload flow, release, privacy notice, data retention, notification/email and deletion procedures are complete and tested.
6. When fully ready, set `ENABLE_SUBMISSIONS` to `true` in Worker variables and redeploy.

## API endpoints
- `GET /api/health` reports whether the Worker is running and whether submissions are enabled.
- `POST /api/submissions/init` validates participant declarations and Turnstile, then creates a private upload session.
- `PUT /api/submissions/{submission-id}/answers/{question-number}` uploads one WebM/MP4 answer to the private staging prefix.
- `POST /api/submissions/{submission-id}/finalize` verifies every expected staged object, copies it into the final private submission folder, and writes `submission.json`.
- There is intentionally no public file listing or download endpoint.

The current front end sends JSON to the init endpoint, then sends each video as a separate raw request. The Worker requires the participant fields, Adobe release declaration and Turnstile token at init. Each video request requires the private bearer token returned by init.
- `legalName`, `email`, `dob`, `signature`, `consent=true`
- `credit` (`full`, `preferred`, or `none`)
- `preferredName` when credit is `preferred`
- `turnstileToken`
- `answer1` through `answer8` as WebM or MP4 files

Limits: 40 MB per clip, 200 MB total, maximum 20 clips.

Configure an R2 lifecycle rule for the `pending/` prefix to expire staged upload objects after 3 days. Do not apply this rule to `submissions/`.

## Security notes
- The R2 bucket must remain private. Do not enable public access or create a public development URL.
- Never put R2 S3 credentials, Cloudflare API tokens, Adobe/Frame.io tokens or other secrets in the website files or GitHub.
- This scaffold does not yet email signed release PDFs, generate legally robust e-signatures, send notifications, or upload to Frame.io.
- The participant metadata and videos are sensitive personal data. Restrict access to the Cloudflare account and use an appropriate retention/deletion policy.
