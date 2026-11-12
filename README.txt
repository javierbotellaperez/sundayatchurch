SUNDAY AT CHURCH — FRAME.IO CONNECTION V3

Replace these two files in the GitHub repository:
- oauth/connect.html
- oauth/callback.html

Commit both changes to the main branch and wait for GitHub Pages to publish.

This version stores the short-lived OAuth state and PKCE verifier in localStorage
instead of sessionStorage, so they can be read if Adobe returns in a separate tab.
The callback removes both values before attempting the token exchange.

No access token is stored in GitHub or localStorage. This is still a browser-only
connection test; Adobe or Frame.io CORS restrictions may still prevent token/API
requests from GitHub Pages.

Do not share authorisation codes, access tokens, or PKCE verifier values.
