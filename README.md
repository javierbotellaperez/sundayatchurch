# Sunday At Church — bilingual Confessional prototype

This version provides an English / Spanish interface and a shortened draft participation release.

## Important status
This is a **prototype**, not ready to collect real participant data. It does not upload recordings, email signed forms, create legally reliable signed PDFs, or connect to Frame.io. The rights clause and data-protection notice are placeholders pending written clarification from IADT and appropriate review.

## Files
- `index.html` — bilingual landing page
- `confessional.html` — bilingual release and local recording interface
- `confessional.js` — browser-local webcam recording
- `site.js` — language switching and bilingual draft text
- `styles.css` — visual design

## Deploy
Upload the individual files to the root of your `sundayatchurch` repository (not the ZIP itself). Keep `index.html` at the repository root. In Settings → Pages, publish `main` from `/(root)`.

## Test locally
Run `python3 -m http.server 8000` from this folder and visit `http://localhost:8000`. Camera access generally requires HTTPS or localhost.

## Before real submissions
1. Confirm copyright and institutional licensing position with IADT.
2. Finalise the release and a GDPR-compliant privacy notice with the correct data controller, legal basis, retention, access and rights information.
3. Add a secure backend for participant registration, e-signature evidence, PDF generation, email delivery and private storage.
4. Integrate Frame.io through a server-side API connection. Never put Frame.io credentials in frontend JavaScript.
5. Test security, consent withdrawal and deletion procedures.


## Frame.io OAuth callback (setup scaffold)

The `oauth/callback.html` file has been added at the redirect path registered in Adobe Developer Console:

`https://javierbotellaperez.github.io/sundayatchurch/oauth/callback.html`

This is currently a **callback scaffold**, not a completed Frame.io integration. It checks the OAuth `state` value if one has been placed in this browser session, removes callback query parameters from the address bar, and does not display or store authorisation codes or tokens. The PKCE sign-in page and secure token-exchange flow still need to be implemented and tested before connecting a real Frame.io account.

Keep the Adobe client ID in the eventual public SPA code only if required; never put access tokens, refresh tokens, client secrets, participant videos, or signed releases in this public GitHub repository.
