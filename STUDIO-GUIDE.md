# Studio Guide — local-site-template

This document covers three things: a synopsis of what was built and why (for future sessions), a security model explanation, and the client deployment workflow.

---

## Build Synopsis

**Stack:** Vanilla HTML + CSS + JS. No npm, no build step, no framework. Deploy target is Vercel via git push. Contact forms use Web3Forms (zero backend).

**Repo:** `kronlemonade/local-site-template` — every client site forks from this repo.

### Key architectural decisions

**CSS custom properties for all brand values.** Every color, font, spacing constant, and border radius lives in `:root` in `css/style.css`. Rebranding a client site is a single block edit — nothing is hard-coded elsewhere.

**Mobile-first with one breakpoint.** Base styles target 375px. One breakpoint at 768px handles desktop. No horizontal scroll at any viewport width. Touch targets are minimum 44×44px.

**Web3Forms over a custom backend.** Form submissions are handled by `fetch()` to `api.web3forms.com`. No server required. The access key lives in `js/main.js` as a named constant (`WEB3FORMS_ACCESS_KEY`) at the top of the file for easy per-client swap.

**Honeypot spam protection.** A hidden checkbox field (`name="botcheck"`) is visually hidden via `.visually-hidden` — position absolute, 1px×1px, clipped. Not `display:none`, which some bots detect. The field is wrapped in `aria-hidden="true"` so screen readers skip it.

**Canonical URL injected by JS.** Rather than a static `<link rel="canonical">` with a placeholder URL (which fails Lighthouse SEO), `main.js` injects a self-referencing canonical at runtime: `window.location.origin + window.location.pathname`. This is always correct on any domain without a manual edit. In production, replace with a static tag if preferred.

**Font loading is non-render-blocking.** Google Fonts is loaded as `rel="preload"` with `as="style"`, then `main.js` immediately swaps `rel` to `stylesheet`. No inline `onload` attribute — keeps the page CSP-compliant.

**Gallery and Testimonials are commented out by default.** Both sections are in the HTML, fully styled, just wrapped in HTML comments. Uncomment when the client has real images or reviews.

### Lighthouse scores (mobile, simulated throttling)
- Performance: 100
- Accessibility: 95
- Best Practices: 96
- SEO: 100

---

## Security Model

### What the Web3Forms access key is and isn't

The access key is embedded in `<input type="hidden" name="access_key">` and sent with every form POST. It is visible in page source, visible in DevTools network tab, and visible to anyone who submits the form. **This is by design.** Web3Forms is a client-side service — the key is an account identifier, not a backend secret.

Vercel environment variables are Node.js/Edge server-side only. This site has no build step and no server runtime, so there is nowhere to inject an env var into a static file. Environment variables do not solve this problem for a no-build static site.

**The correct protection is domain allowlisting in the Web3Forms dashboard.** Add the client's domain after deploy. Web3Forms will reject submissions originating from any other domain even if someone copies the key.

### Headers

All responses get the following headers via `vercel.json`:

| Header | Value | Purpose |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; connect-src api.web3forms.com; form-action api.web3forms.com 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'` | Blocks XSS payload delivery, data exfiltration, and unauthorized framing |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years; eligible for HSTS preload list |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-Frame-Options` | `DENY` | Belt-and-suspenders frame blocking (backs up CSP frame-ancestors) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limits referrer leakage to third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Disables sensitive browser APIs |

### CSP additions per client

If a client needs a third-party embed, add the relevant directive to `vercel.json`:

- Google Maps iframe: add `frame-src https://www.google.com`
- YouTube embed: add `frame-src https://www.youtube.com`
- Calendly widget: add `frame-src https://calendly.com` and `script-src 'self' https://assets.calendly.com`
- Google Analytics: add `script-src 'self' https://www.googletagmanager.com` and `connect-src https://www.google-analytics.com https://www.googletagmanager.com`

---

## Client Deployment Workflow

### Step 1 — Create a new repo from the template

**One-time setup:** Go to the `local-site-template` repo on GitHub → Settings → check **"Template repository"**. This enables the "Use this template" button for the owner (forking your own repo is not possible on GitHub).

From that point, each new client:

1. Go to `github.com/kronlemonade/local-site-template`
2. Click **"Use this template" → "Create a new repository"**
3. Name it `[client-slug]-site`, set visibility, create

Or via CLI (create the new repo on GitHub first, then):

```bash
git clone https://github.com/kronlemonade/local-site-template.git [client-slug]-site
cd [client-slug]-site
git remote set-url origin https://github.com/kronlemonade/[client-slug]-site.git
git push -u origin main
```

### Step 2 — Global find-and-replace all `[bracket]` placeholders

Every client-variable value uses `[bracket]` syntax. Run a global find-and-replace in your editor across all files:

| Placeholder | Replace with |
|---|---|
| `[Business Name]` | Client's business name |
| `[City]` | Primary city served |
| `[State]` | State abbreviation |
| `[ZIP]` | ZIP / postal code |
| `[Street Address]` | Full street address |
| `[County/Region]` | County or region name |
| `[Year]` | Year business was founded |
| `[phone number]` | Display format e.g. `(555) 123-4567` |
| `+1XXXXXXXXXX` | E.164 format e.g. `+15551234567` |
| `[contact@yourdomain.com]` | Client email |
| `[yourdomain.com]` | Client domain (no https://) |
| `[primary service]` | Main service e.g. `plumbing` |
| `[service type]` | Category e.g. `plumbing services` |
| `[Service Name 1–6]` | Individual service names |
| `[One-sentence value prop]` | Key differentiator |

### Step 3 — Web3Forms key

**For demos and client previews:** the studio key already in the template is fine. Submissions route to your inbox, which is useful for showing the client the form actually works.

**Before a site goes live on the client's domain:**
1. Create a new form in the Web3Forms dashboard for this client
2. Update `js/main.js` line 4: `const WEB3FORMS_ACCESS_KEY = 'client-key-here';`
3. Update the `input[name="access_key"]` value in `index.html` (no-JS fallback)
4. Update the `subject` hidden input to reflect the client's business name
5. Add the client's live domain to the Web3Forms allowed origins list

### Step 4 — Update brand colors

Edit the `:root` block at the top of `css/style.css`:

```css
:root {
  --color-primary:      #2563eb;  /* Main brand color */
  --color-primary-dark: #1d4ed8;  /* Hover / active */
  --color-accent:       #f59e0b;  /* Call Now button */
  --color-accent-dark:  #d97706;
  --color-text:         #1f2937;
  --color-text-light:   #6b7280;
  --color-bg:           #ffffff;
  --color-bg-alt:       #f9fafb;
}
```

Everything in the site references these variables. No other color edits needed.

### Step 5 — Swap favicon and touch icon

- `favicon.svg` — Edit the `[L]` text placeholder to the client's initial or a simple logo mark. Keep the 32×32 viewBox.
- `apple-touch-icon.png` — Replace with a 180×180 PNG. Match the primary brand color as background.

### Step 6 — Fill in the JSON-LD schema

In `index.html`, find `<script type="application/ld+json">` and fill in every field. Don't skip `geo.latitude` and `geo.longitude` — they strengthen the Google Maps association for local search.

### Step 7 — Fill in service cards

Edit the 6 `.service-card` blocks in `index.html`. Remove cards if the client has fewer than 6 services. The grid auto-adjusts (2-col mobile, 3-col desktop).

### Step 8 — Uncomment optional sections

**Gallery:** Uncomment the `<!-- GALLERY -->` block, add images to `images/gallery/`, set explicit `width` and `height` on each `<img>`, and write descriptive `alt` text.

**Testimonials:** Uncomment the `<!-- TESTIMONIALS -->` block and add real customer quotes. Never use fabricated reviews.

**Social links:** In the footer, uncomment the `.footer-social` div and populate with real profile URLs.

### Step 9 — Replace OG image

Replace `images/og-image.jpg` with a 1200×630 branded image. This appears when the URL is shared on social.

### Step 10 — Connect Vercel

1. Push the client repo to GitHub
2. Vercel → Add New Project → Import GitHub repo
3. Root directory: `/` (default — Vercel auto-detects as static)
4. No build command needed
5. Deploy — every push to `main` redeploys automatically

### Step 11 — Post-deploy checklist

- [ ] All `[bracket]` placeholders replaced — search the deployed HTML for `[` to confirm
- [ ] Contact form tested end-to-end — submits and client receives email
- [ ] Web3Forms domain allowlist updated with live domain
- [ ] `robots.txt` sitemap line uncommented and updated with real domain
- [ ] Static canonical tag added to `<head>` (replace the JS-injected one)
- [ ] JSON-LD schema validated at schema.org/SchemaApp or Google's Rich Results Test
- [ ] Lighthouse run on live URL (Performance ≥ 95, A11y ≥ 95, BP ≥ 95, SEO ≥ 95)
- [ ] Tested on real iOS and Android devices
- [ ] Social share image verified (use opengraph.xyz)

---

## File Reference

```
local-site-template/
├── index.html           Main homepage — all sections
├── page-template.html   Copy for each inner page (services detail, about, etc.)
├── 404.html             Custom 404 with nav and home link
├── robots.txt           Update sitemap URL after domain is set
├── favicon.svg          32×32 SVG — edit [L] text placeholder
├── apple-touch-icon.png 180×180 PNG iOS home screen icon
├── css/
│   ├── reset.css        Minimal box-model + typography reset
│   └── style.css        All styles; :root vars at top for rebrand
├── js/
│   └── main.js          Nav toggle, font load, canonical, form, copyright year
├── images/
│   ├── og-image.jpg     1200×630 social share image
│   └── placeholder/     Local color-block PNGs (no external CDN dependency)
└── vercel.json          Security headers + clean URL config
```

---

## Adding Inner Pages

Copy `page-template.html`, rename to the page slug (e.g. `services.html`), and update:

1. `<title>`, `<meta name="description">`, and `<link rel="canonical">`
2. The breadcrumb (`aria-current="page"` on the last item)
3. The `<h1>` and page subtitle
4. The main content section
5. Update the nav links on all pages to include the new page

With `"cleanUrls": true` in `vercel.json`, `services.html` is served at `/services` — no `.html` in the URL.
