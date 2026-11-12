# Sunday At Church — prototype

A static GitHub Pages starter with:
- A landing page for the two documentary spaces
- A working local webcam/audio confessional prototype
- Per-question WebM recording and manual download
- A placeholder page for the future live cruising room

## Run locally
Camera/microphone access generally requires HTTPS or localhost.
From this folder, run:

    python3 -m http.server 8000

Then visit http://localhost:8000

## Publish with GitHub Pages
1. Create a GitHub repository (for example `sunday-at-church`).
2. Upload all files in this folder to the repository root.
3. In Settings → Pages, choose deploy from the `main` branch and `/ (root)`.
4. Open the generated HTTPS URL and test camera/microphone permissions.

## Important prototype limitations
- Recordings are created in the browser and downloaded manually; they are NOT uploaded or stored on a server.
- Each answer is a separate `.webm` file. Browser support varies.
- This is not yet suitable for collecting real documentary participant footage. Before public use, add a proper participant information/consent process, secure authenticated upload, access controls, retention/deletion policy, and GDPR review.
- The Cruising Room is a placeholder. Real-time one-to-one video requires a signalling/video service (for example LiveKit) and server-side token generation. Never put API secrets in GitHub Pages frontend code.
- The question copy is placeholder material and can be edited in `confessional.js`.
