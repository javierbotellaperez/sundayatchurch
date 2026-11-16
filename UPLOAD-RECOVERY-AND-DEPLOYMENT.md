# Sunday At Church — safer upload implementation notes

## What changed

The visual design, four-step participant journey, question bank, consent controls, Adobe Sign embeds, language-specific pages and manual-verification workflow are unchanged.

The upload implementation now uses:

1. **Local recovery:** each completed recording is saved to browser IndexedDB as well as held in memory. On a later visit in the same browser, the page attempts to restore saved clips and any interrupted upload session.
2. **Separate uploads:** the browser creates a submission session, then uploads each answer as its own request. A failed answer can be retried without bundling all recordings into one request.
3. **Visible progress:** the participant sees the answer currently being uploaded and a progress indicator that advances after each answer is stored and checked.
4. **Private staging:** individual videos first go into `pending/<submission-id>/answers/`. They are copied into `submissions/<submission-id>/` only when the participant finishes.
5. **Server-side verification:** after each upload, the Worker checks the R2 object and its size. Finalization checks every expected answer again and writes `submission.json`. Only then does the browser show the reference code and clear its local copies.
6. **Retry-safe finalization:** the private upload session is retained temporarily so a lost final HTTP response can be retried without creating a second submission.
7. **Leave-page warning:** the browser warns when there are recordings without a confirmed submission.

## Important limitations

- IndexedDB is browser-managed local storage, not an encrypted backup. It may be cleared by the participant, browser settings, storage pressure or private-browsing restrictions. The page now tells participants that recordings are temporarily stored in the browser and advises against shared devices. The current privacy-notice PDFs do not yet describe this browser storage: update and review both notices before accepting real submissions. The page still offers per-answer download links; participants should download important recordings if they want an independent copy.
- The progress bar advances per completed answer. It does not show byte-by-byte network progress within an individual video.
- A participant's Adobe Sign completion checkbox remains a self-declaration. It is not automatic proof that the signed PDF has been received or verified. Keep the existing manual matching workflow.
- The Worker confirms that files exist in private R2 with the expected sizes. It does not verify that a video can be decoded or played. Check playback during your manual review.
- An incomplete upload is staged under `pending/`. Configure an R2 lifecycle rule to expire objects with prefix `pending/` after **3 days**. Do not apply that lifecycle rule to `submissions/`.
- A successful submission remains marked `awaiting_manual_verification`. This is not approval of the release or footage.

## Files changed

- `confessional.html`, `confessional-en.html`, `confesionario.html`: added a small native upload progress element; no layout redesign.
- `confessional.js`, `confessional-en.js`, `confesionario.js`: local IndexedDB recovery, resumable per-answer upload, progress and leave-page warning.
- `src/index.js`: new init / individual-answer / finalize API flow, staging prefix and R2 verification.
- `UPLOAD-RECOVERY-AND-DEPLOYMENT.md`: these implementation and deployment notes.

## Deployment checklist

1. Keep the R2 bucket `sundayatchurch` **private**.
2. Deploy the updated website files to the existing GitHub Pages repository.
3. Deploy the updated Worker from `src/index.js`.
4. Keep the existing `BUCKET` R2 binding and `TURNSTILE_SECRET_KEY` Worker secret.
5. Confirm `ALLOWED_ORIGINS` includes the exact live website origins.
6. Confirm the Turnstile widget allows the live hostnames and the public site key matches the Worker secret.
7. In R2, create a lifecycle rule for prefix `pending/` that expires staged objects after 3 days. Never apply it to `submissions/`.
8. Check `/api/health`.
9. Run controlled end-to-end tests with non-sensitive test footage in both languages. Test one clip, multiple clips, a failed/retried clip, a refresh before upload, a refresh during upload, and a lost/ retried final confirmation.
10. In R2, verify a completed submission contains `question-XX.webm` or `.mp4` and `submission.json` under `submissions/SAC-XXXXXXXX/`. Verify no staged copies remain after lifecycle cleanup.
11. Only enable real submissions once the release, privacy notice, IADT position, retention/deletion process and manual verification workflow are ready.

## Wrangler warning

The supplied `wrangler.toml` currently has `ENABLE_SUBMISSIONS = "false"`. This is a safe default. If you deploy with Wrangler, confirm the live Worker variable afterwards; do not change it to `true` until the controlled tests and project checks above are complete. Keep secrets out of GitHub.
