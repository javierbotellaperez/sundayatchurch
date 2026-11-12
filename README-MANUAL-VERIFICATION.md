# Sunday At Church — Adobe Sign + manual footage verification

## What this version changes

- The Confessional page embeds the existing English and Spanish Adobe Sign web forms.
- The participant must confirm that they have completed the Adobe Sign form before recording and submitting footage.
- The typed-name signature field has been removed from the Confessional. Adobe Sign is the signature process.
- The upload Worker stores each submission in the private R2 bucket and records the submission as `awaiting_manual_verification`.
- The Worker does **not** claim that the Adobe signature has been verified. The checkbox is only the participant's statement; you must check the completed Adobe agreement yourself.
- No public R2 listing or download endpoint has been added.

## Files to replace in the GitHub repository

At the repository root, replace:

- `confessional.html`
- `confessional.js`
- `site.js`
- `styles.css`

In the Worker source, replace:

- `src/index.js`

Do not rename `src/index.js`. Keep your existing `wrangler.toml` and Cloudflare bindings/secrets unchanged.

## Important Cloudflare setting

Keep `ENABLE_SUBMISSIONS` set to `false` while testing. The API will continue to refuse uploads until you deliberately change this setting. Do not enable real submissions just because the page has been updated.

The existing Turnstile site key, Worker URL, bucket binding and secret are retained. Do not put the Turnstile secret in GitHub or in frontend files.

## Participant workflow

1. Participant selects English or Spanish. The matching Adobe Sign web form is shown.
2. Participant completes the Adobe Sign release. Adobe sends the signed agreement to the participant and makes the completed agreement available in your Acrobat Sign account.
3. Participant enters the same legal name and email address in the Confessional form. This is how you will match the Adobe agreement to the footage submission.
4. Participant checks the confirmation box, records their answers and submits them.
5. The Worker assigns a reference such as `SAC-XXXXXXXX` and stores the clips and a private `submission.json` in R2 under `submissions/<reference>/`.
6. The participant sees the reference code. You use that code in your internal tracker.

## Your manual verification and archive workflow

For each new submission:

1. Open Acrobat Sign and find the completed agreement using the participant's legal name/email. Confirm its status is completed and download the signed PDF.
2. Open Cloudflare Dashboard → R2 → `sundayatchurch` → `submissions/` → the matching `SAC-...` folder. Download `submission.json` and all `answer-XX` video files.
3. Match the legal name/email in `submission.json` against the completed Adobe agreement. Do not mark it verified if the identity or agreement cannot be matched.
4. Copy the signed PDF and footage into the participant's folder on your encrypted primary SSD. Make a second encrypted backup.
5. Open/check the copied PDF and video files. Only after both copies have been verified, mark the row `Archived` in the tracker.
6. Delete the temporary R2 folder only after successful transfer and verification. Your stated retention plan is a maximum of seven days in R2 after the transfer and verification are complete.

Suggested folder naming on your drives:

`Sunday At Church / Participants / SAC-XXXXXXXX /`

- `release_signed.pdf`
- `submission.json`
- `answer-01.webm` … `answer-08.webm`

Keep the identity/contact details and footage protected. The anonymous reference should be used in production notes and filenames wherever practical.

## Status meanings for the tracker

- `Awaiting signature`: no completed Adobe agreement has been found yet.
- `Awaiting footage`: the signed Adobe PDF is verified, but no matching footage submission has arrived.
- `Ready to archive`: both the signed PDF and footage have been checked and downloaded.
- `Archived`: both encrypted copies have been checked and the temporary R2 copy has been deleted.
- `On hold`: mismatch, missing file, incomplete agreement, or another issue needs resolving.

## Test before launch

- Check that the English button displays only the English Adobe form.
- Check that the Spanish button displays only the Spanish Adobe form.
- Complete a test agreement using a test identity and verify that Adobe sends the signed PDF.
- Test the recording/upload flow only while using test data and while you intentionally control the Worker setting.
- Confirm the resulting R2 folder contains the clips and `submission.json`, with `overallStatus` set to `awaiting_manual_verification`.
- Confirm the participant's reference code matches the folder name.
- Keep real submissions disabled until the complete process, privacy notice and institutional requirements are ready.

## Important limitation

The web page cannot independently prove that an Adobe agreement was signed. The participant checkbox is not proof of signature. The system deliberately marks every upload as pending until you manually match the signed Adobe PDF with the participant details and footage. The signed PDF is not automatically copied into R2 by this version; you download it from Acrobat Sign and archive it yourself.
