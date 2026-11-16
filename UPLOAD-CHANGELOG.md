# Upload reliability change log

- Replaced the single multipart upload with a three-stage API: initialize, upload each answer, finalize.
- Added browser-side IndexedDB recovery for completed clips and active upload credentials.
- Added per-answer retry and a resumable session token (48-hour server-side validity).
- Added per-answer progress and a warning before leaving with unconfirmed recordings.
- Added private R2 staging under `pending/`; final submission files are copied into `submissions/` only during finalization.
- Added R2 `head()` checks after each answer and after final metadata creation.
- Made finalization retry-safe if the browser loses the successful response.
- Kept the Adobe Sign declaration as a participant declaration and retained manual release/footage verification.
- Added explanatory comments to the Worker and upload code.

No changes were made to the question wording, Adobe Sign form URLs, consent checkboxes, question navigation, language entry points, or overall visual design.
