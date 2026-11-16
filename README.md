# Sunday At Church — bilingual website + Cloudflare backend scaffold

This package contains the bilingual Confessional website and a Cloudflare Worker/R2 backend scaffold.

## Upload to GitHub
1. Unzip this package.
2. Open the existing repository `javierbotellaperez/sundayatchurch`.
3. Upload the **contents** of this folder to the repository root, preserving the `src/` folder.
4. Replace the existing website files when GitHub asks. Do not upload the ZIP file itself.
5. Commit to `main`.

Keep the R2 bucket private. Do not put API tokens or secrets in GitHub.

## Cloudflare
See `CLOUDFLARE-SETUP.md` for the Worker deployment and R2 binding instructions. The Worker project name is `sundayatchurch-api`.

## Important
This is not yet a live submission system. The front-end now includes Turnstile and is wired to the Worker upload endpoint, but the endpoint remains disabled. The Worker is deliberately configured with `ENABLE_SUBMISSIONS = "false"`. Do not enable real submissions until the upload interface, Turnstile, participant release, privacy notice, IADT rights position, email/PDF workflow and retention/deletion procedures are complete and tested.


## Safer upload flow
See `UPLOAD-RECOVERY-AND-DEPLOYMENT.md` for the resumable per-answer upload implementation, local browser recovery, R2 staging lifecycle rule and deployment checklist.
