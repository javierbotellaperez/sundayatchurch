# Sunday At Church — bilingual website + Cloudflare backend

This package contains the bilingual Confessional website and the Cloudflare Worker/R2 upload backend.

## Deploy website
1. Unzip this package.
2. Upload the contents of `sundayatchurch/` to the root of the existing GitHub Pages repository.
3. Preserve `src/` for the Worker source; do not upload `.git` or `__MACOSX` folders.
4. Commit the changes to `main`.

## Deploy Worker
Deploy `src/index.js` to the existing Worker `sundayatchurch-api`, keeping the existing private R2 binding `BUCKET`, Turnstile secret and allowed origins. Do not publish secrets or make the R2 bucket public.

## Participant release options
- **Standard:** existing legal-name / email / date-of-birth form and the existing English or Spanish Adobe Sign embed.
- **Anonymous:** no legal name, email address or date of birth is requested. The participant confirms they are 18+, gives explicit consent, optionally enters a pseudonym, and signs by typing or drawing. The browser creates a PDF and downloads a participant copy; the PDF is also uploaded to private R2 and linked to the submission record. The record uses a unique `SAC-XXXXXXXX` reference and stores only the optional pseudonym (if supplied), language, consent state and release mode in participant metadata.
- Both routes continue through the same video upload and manual review process. A submission is not marked approved automatically.

The anonymous route uses jsPDF from cdnjs. The participant needs an internet connection for this library to load. If it fails to load, the form displays an error and does not submit.

## Cloudflare / R2
- Keep the R2 bucket private.
- Keep `TURNSTILE_SECRET_KEY` as a Worker secret.
- Keep `ALLOWED_ORIGINS` restricted to the live website origins.
- Configure the existing R2 lifecycle rule for `pending/` staging objects only. Do not expire `submissions/`.
- Anonymous release PDFs are stored at `submissions/SAC-XXXXXXXX/anonymous-release.pdf`.
- Submission metadata is stored at `submissions/SAC-XXXXXXXX/submission.json`.

## Important checks before real use
1. Deploy the website and Worker together.
2. Test both languages and both release routes with test footage.
3. Confirm the anonymous PDF downloads and is present in private R2 after finalization.
4. Confirm the submission metadata contains no legal name, email or date of birth for anonymous participants.
5. Confirm the standard Adobe Sign workflow is unchanged.
6. Confirm the privacy notices accurately describe anonymous release PDFs, browser-local recording recovery, storage, retention, access and deletion.
7. Obtain Irish legal review of both release versions and the GDPR / Article 9 consent language before commercial distribution.

## Existing configuration warning
The supplied `wrangler.toml` sets `ENABLE_SUBMISSIONS = "true"`. This is an existing setting in the uploaded version. Do not change it unintentionally; confirm the live Worker configuration and test with controlled submissions before public use.
