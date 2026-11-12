# Sunday At Church — First Confessional release

This package updates the Confessional page with the Windows XP / early-2000s visual direction, explains the two project phases, presents the question bank in English and Spanish, embeds the two Adobe Sign web forms, and keeps manual verification as the submission workflow.

## Files to replace in GitHub

- `confessional.html` → repository root
- `confessional.js` → repository root
- `styles.css` → repository root
- `src/index.js` → replace the existing Worker source

Keep your existing `site.js`, `index.html`, `wrangler.toml`, Turnstile site key, Worker secret and R2 binding. This package does not contain or change secrets.

## Important workflow details

- The nine core prompts are marked CORE; the remaining prompts are OPTIONAL.
- Participants may record any of the 20 prompts and skip anything.
- The opening confession is prompt 1: “I confess that the last time I went to a sauna was…”
- English and Spanish Adobe Sign forms are embedded. The language switch shows the corresponding form.
- The participant must declare that the Adobe Sign release has been completed. This is not automatic verification.
- Every uploaded submission is stored with `submissionStatus: awaiting_manual_verification`, `releaseStatus: awaiting_manual_verification` and `footageStatus: received_pending_review`.
- The Worker does not provide public download/list endpoints. Retrieve objects through the private R2 dashboard or your controlled admin process.
- The upload handler accepts up to 20 clips, max 40 MB each and max 200 MB total.

## Before deploying

1. Keep the R2 bucket private.
2. Confirm `ALLOWED_ORIGINS` includes `https://javierbotellaperez.com` and `https://www.javierbotellaperez.com` if both are used.
3. Keep the existing Turnstile site key and matching secret configured. Ensure Turnstile allows hostname `javierbotellaperez.com`.
4. Confirm `ENABLE_SUBMISSIONS` is intentionally set to `true` only if you are ready to accept real submissions.
5. Test first with a consenting adult friend using non-sensitive test footage and test contact details. Do not use a real Adobe agreement unless you intend it to be legally signed.
6. Check `/api/health` and confirm `submissionsEnabled: true`.
7. Check that the test upload creates a `submissions/SAC-XXXXXXXX/` folder containing question clips and `submission.json`.
8. Manually verify the signed PDF and every uploaded clip, archive to encrypted drives, verify the copies, and only then delete the temporary R2 copy.

## Manual review tracker

For every submission, record:
- reference ID
- Adobe signed PDF received and signature verified
- footage files received and playable
- copied to primary encrypted SSD
- copied to secondary encrypted drive
- both copies verified
- R2 copy deleted after verification

Do not mark a participant as approved merely because they ticked the Adobe checkbox. The checkbox is a self-declaration; the PDF must be checked manually.

## Privacy and legal note

This is a technical and editorial implementation, not legal approval. Before public launch, ensure the privacy notice accurately describes the actual controller, legal basis, special-category data handling where relevant, processors, hosting locations, retention, security, participant rights and contact route. Do not promise anonymity through post-production: participants must understand the agreed limits before recording.
