# Local Site Template

A production-ready static site starter for local business websites. Fork this repo for each new client — every client site is one `git push` away from a live Vercel deploy.

## Stack

- Vanilla HTML + CSS + JS — no npm, no build step, no framework
- [Vercel](https://vercel.com) for hosting (git push = deploy)
- [Web3Forms](https://web3forms.com) for contact form submissions (zero backend)
- Honeypot spam protection built in

---

## Quickstart — New Client Setup

### 1. Fork / duplicate the repo

**One-time setup:** In the `local-site-template` repo on GitHub, go to Settings and check **"Template repository"**. This enables the "Use this template" button — you cannot fork your own repo on GitHub, so this is the correct mechanism.

Each new client site:

1. Go to the `local-site-template` repo on GitHub
2. Click **"Use this template" → "Create a new repository"**
3. Name it `[client-slug]-site`

Or via CLI (create the empty repo on GitHub first, then):

```bash
git clone https://github.com/kronlemonade/local-site-template.git [client-name]-site
cd [client-name]-site
git remote set-url origin https://github.com/kronlemonade/[client-name]-site.git
git push -u origin main
```

### 2. Find-and-replace all `[bracket]` placeholders

Every placeholder in the codebase uses `[bracket]` syntax so a single
global find/replace pass covers the whole site.

| Placeholder | Replace with |
|---|---|
| `[Business Name]` | Client's business name |
| `[City]` | Primary city served |
| `[State]` | State abbreviation (e.g. `TX`) |
| `[ZIP]` | ZIP code |
| `[Street Address]` | Street address |
| `[County/Region]` | County or region name |
| `[Year]` | Year business was founded |
| `[phone number]` | Display phone, e.g. `(555) 123-4567` |
| `+1XXXXXXXXXX` | E.164 phone, e.g. `+15551234567` |
| `[contact@yourdomain.com]` | Client email |
| `[yourdomain.com]` | Client domain |
| `[primary service]` | Main service, e.g. `plumbing` |
| `[service type]` | Service category, e.g. `plumbing services` |
| `[Service Name 1–6]` | Individual service names |
| `[One-sentence value prop]` | Key differentiator |

### 3. Web3Forms key

**For demos and client previews:** the studio key already in the template is fine. Submissions go to your inbox, which is useful for showing clients the form works live.

**Before a site goes live on the client's own domain:**

1. Create a new form in the Web3Forms dashboard for this client
2. Open `js/main.js` and update the constant at the top:
   ```js
   const WEB3FORMS_ACCESS_KEY = 'client-key-here';
   ```
3. Also update the `input[name="access_key"]` value in `index.html` (no-JS fallback)
4. Update the `subject` hidden input to include the client's business name
5. **Add the client's live domain to the Web3Forms allowed origins list** — this is the real protection. The key is a client-side identifier by design; domain allowlisting ensures submissions from any other origin are rejected.

### 4. Swap favicon and touch icon

- **`favicon.svg`** — Replace the `[L]` text with the client's initial or
  a simple logo mark. Keep the 32×32 viewBox.
- **`apple-touch-icon.png`** — Replace with a 180×180 PNG of the logo on
  a solid brand-color background.

### 5. Update CSS brand colors

Open `css/style.css` and edit the `:root` block at the top. All brand
colors reference these variables, so a single change rebrands the entire site:

```css
:root {
  --color-primary: #2563eb;      /* Main brand color */
  --color-primary-dark: #1d4ed8; /* Hover/active state */
  --color-accent: #f59e0b;       /* CTA accent (Call Now button) */
  --color-accent-dark: #d97706;
  /* ...rest unchanged for most clients */
}
```

### 6. Update the JSON-LD schema

In `index.html`, find the `<script type="application/ld+json">` block and
fill in all fields with accurate client data. Don't skip lat/long — it
helps Google Maps association.

### 7. Enable optional sections

**Gallery** — Uncomment the `<!-- GALLERY -->` section in `index.html`,
add images to `images/gallery/`, and update `alt` text per image.

**Testimonials** — Uncomment the `<!-- TESTIMONIALS -->` section and add
real customer quotes. Never use fabricated reviews.

**Social links** — In the footer, uncomment the social block and add the
client's real profile URLs.

### 8. Connect to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import the GitHub repo — Vercel auto-detects it as a static site
4. Set the root directory to `/` (default)
5. Every push to `main` deploys automatically

---

## File Structure

```
local-site-template/
├── index.html          ← Main homepage
├── page-template.html  ← Copy for each inner page (services, about, etc.)
├── 404.html            ← Custom 404 error page
├── robots.txt          ← Update sitemap URL after domain is set
├── favicon.svg         ← SVG favicon (32×32 viewBox)
├── apple-touch-icon.png← 180×180 PNG for iOS home screen
├── css/
│   ├── reset.css       ← Minimal box-model / typography reset
│   └── style.css       ← All styles; :root vars at top for easy rebrand
├── js/
│   └── main.js         ← Nav toggle, form handling, copyright year
├── images/
│   ├── og-image.jpg    ← 1200×630 social share image (replace per client)
│   └── placeholder/    ← Color-block placeholder PNGs (no external CDN)
└── vercel.json         ← Security headers + clean URL config
```

---

## CSS Architecture Notes

All client-variable values (colors, font stack, max-width, spacing) live
in `css/style.css` under `:root`. No values are hard-coded outside of this
block. To rebrand: change the `:root` vars and nothing else.

The breakpoint system is intentionally minimal:
- **Base** styles target 375px (smallest common phone)
- **Single breakpoint** at `768px` switches to desktop layout
- No horizontal scroll at any viewport width — tested at 320px and 1440px

---

## Accessibility Checklist (per client deploy)

- [ ] All `[bracket]` placeholders replaced — no raw brackets visible to users
- [ ] All images have descriptive `alt` text (decorative images get `alt=""`)
- [ ] Phone numbers use `<a href="tel:...">` — tap-to-call on mobile
- [ ] Form inputs each have an associated `<label>`
- [ ] Hamburger has `aria-expanded`, `aria-controls`, and visible focus state
- [ ] Color contrast passes WCAG AA (check with browser DevTools or axe)
- [ ] Test with keyboard-only navigation (Tab, Enter, Escape)

---

## Performance Notes

- Google Fonts loaded with `preconnect` hints to minimize render-blocking
- Gallery images use `loading="lazy"` and explicit `width`/`height`
- No JS frameworks — main.js is < 3 KB uncompressed
- No external JS dependencies — zero third-party script latency
- Placeholder images are local PNGs (no external CDN requests on load)

---

## Per-Client Customization Quick Reference

| Task | File | What to change |
|---|---|---|
| Brand colors | `css/style.css` | `:root` custom properties |
| Font | `css/style.css` | `--font-heading` / `--font-body` + Google Fonts link in HTML |
| Logo | `index.html` | Replace `.nav-logo` text with `<img>` tag |
| Services | `index.html` | Edit `.service-card` blocks; remove/add as needed |
| Form destination | `js/main.js` | `WEB3FORMS_ACCESS_KEY` constant |
| Schema | `index.html` | `<script type="application/ld+json">` block |
| OG image | `images/og-image.jpg` | Replace with 1200×630 branded image |
| Favicon | `favicon.svg` | Swap `[L]` for initials or logo mark |

---

## License

MIT. Use freely for client projects.
