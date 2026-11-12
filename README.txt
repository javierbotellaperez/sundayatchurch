SUNDAY AT CHURCH — FRAME.IO CONNECTION TEST (V2)

Files:
- oauth/connect.html
- oauth/callback.html

Install in GitHub:
1. Open the repository root.
2. Open the existing oauth folder.
3. Replace callback.html with this package's oauth/callback.html.
4. Replace connect.html with this package's oauth/connect.html (or add it if absent).
5. Commit the changes to main and wait for Pages to publish.

Test URL:
https://javierbotellaperez.com/sundayatchurch/oauth/connect.html

Registered redirect:
https://javierbotellaperez.com/sundayatchurch/oauth/callback.html

Adobe Client ID:
243c66aa87e6460f91e6abe0a0ed27c7

Important:
- Uses Adobe's documented OAuth Single-Page App token request format:
  POST https://ims-na1.adobelogin.com/ims/token/v3?client_id=...
  body: grant_type=authorization_code&code=...&code_verifier=...
- Uses PKCE S256 and a state check.
- No client secret is used.
- Does not persist access tokens or refresh tokens in browser storage or GitHub.
- If the token request still fails with CORS, this is not fixable by changing a static HTML file: the browser cannot read Adobe's response. We would then need Adobe to allow the origin or use a server-side component. GitHub Pages itself cannot act as a backend.
- This is only a connection test. It does not upload participant files, create participant folders, generate releases, or email anyone.
