SUNDAY AT CHURCH — FRAME.IO CONNECTION TEST

Files in this package:
- oauth/connect.html: starts Adobe OAuth Single-Page App sign-in with PKCE.
- oauth/callback.html: validates state, exchanges the code, then checks /me and /accounts.

Install:
1. In your GitHub repository, replace oauth/callback.html with this package's version.
2. Add oauth/connect.html.
3. Preserve the oauth folder structure and commit/publish to the main branch.
4. Wait for GitHub Pages to deploy.
5. Open:
   https://javierbotellaperez.github.io/sundayatchurch/oauth/connect.html
6. Click "Continue to Adobe" and sign in with the Adobe account that can access SUNDAYATCHURCH.

Important:
- This is a one-time authentication and API-access test only.
- The public client ID is embedded in the page; that is expected for a public SPA.
- No client secret is used.
- The PKCE verifier and OAuth state are held in sessionStorage only until the callback.
- The access token is held only in the callback page's JavaScript memory and is not saved in GitHub, localStorage, or sessionStorage.
- This does NOT yet create folders, upload participant videos, generate/email releases, or provide a secure participant submission backend.
- If Adobe or Frame.io blocks browser CORS requests, we will need a small backend/proxy. Do not work around that by publishing tokens.

Registered redirect URI:
https://javierbotellaperez.github.io/sundayatchurch/oauth/callback.html

Client ID:
243c66aa87e6460f91e6abe0a0ed27c7
