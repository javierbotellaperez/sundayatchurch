# Anonymous participant release — implementation notes

## What is included
- Bilingual release-mode choice on the Confessional pages.
- Existing Adobe Sign flow retained as the standard route.
- Anonymous route with optional pseudonym, 18+ declaration, explicit special-category-data consent, and typed or drawn signature.
- Browser-generated PDF copy (downloaded to the participant's device) and private R2 storage.
- Anonymous metadata excludes legal name, email and date of birth.
- The anonymous release PDF is associated with the same `SAC-XXXXXXXX` submission reference as the video answers.
- Existing per-answer upload, R2 verification, retry and manual-review flow retained.

## Storage
During upload, the PDF is stored under `pending/SAC-XXXXXXXX/anonymous-release.pdf`. On successful finalization, it is copied to `submissions/SAC-XXXXXXXX/anonymous-release.pdf`; the submission record points to that object. The R2 bucket must remain private.

## Limitations / checks
- No email delivery service is configured in the supplied project. The anonymous participant receives a local PDF download; no email address is collected.
- jsPDF is loaded from cdnjs, so PDF generation requires network access to that CDN.
- The PDF states that the submission reference is assigned on receipt; the actual reference links the PDF to the submission in R2 metadata and object path.
- The signature workflow records the participant's typed or drawn mark and a timestamp. It is not identity verification and should not be described as equivalent to Adobe Sign's identity/audit features.
- The current privacy notice PDFs were not rewritten in this patch. They must be updated to explain anonymous release processing, the signed PDF, browser IndexedDB recovery and retention/deletion before accepting real submissions.
- The wording has been aligned to the existing English and Spanish release terms in the supplied participant release PDFs, but legal review in Ireland is still recommended, especially for GDPR Article 9 explicit consent and enforceability.
