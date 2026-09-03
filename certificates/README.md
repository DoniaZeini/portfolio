# Certificates Folder

Place your certificate files (PDF or images) here.

## How to add a certificate

1. **Drop your file** into this `certificates/` folder
   - Supported formats: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`

2. **Edit `index.html`** — find the `<!-- ADD MORE CERTIFICATE CARDS HERE -->` comment in the certificates section and add a card block:

```html
<div class="certificate-card reveal" data-file="certificates/YOUR_FILE_NAME.pdf">
    <div class="certificate-badge">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
    </div>
    <h3 class="certificate-title">Certificate Name Here</h3>
    <span class="certificate-issuer">Issuing Organization</span>
    <button class="certificate-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        <span>View Certificate</span>
    </button>
</div>
```

3. **Update `data-file`** to match your filename (e.g., `certificates/python_cert.pdf`)

## Behavior
- **PDF files** → open in a new browser tab (with built-in save/print)
- **Image files** → open in a popup viewer with Save and Print buttons
