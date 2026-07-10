# Paint Creek Landscaping — Website

Static marketing site for Paint Creek Landscaping, Rochester MI.
Built from the [KronLemonade/local-site-template](https://github.com/KronLemonade/local-site-template) starter.

**Live URL:** https://paintcreeklandscaping.com *(pending domain connection)*

---

## Stack

- Vanilla HTML + CSS + JS — no npm, no build step, no framework
- [Vercel](https://vercel.com) for hosting (push to `main` = live deploy)
- [Web3Forms](https://web3forms.com) for contact form (zero backend)

---

## Deploy

Connect the repo to Vercel once. After that, every push to `main` deploys automatically.

1. [vercel.com](https://vercel.com) → **Add New Project** → Import this repo
2. Root directory: `/` (default)
3. No build command needed

---

## Before Going Live

- [ ] Replace placeholder hero image (`images/og-image.jpg` and hero SVG block in `index.html`) with real photography
- [ ] Update `WEB3FORMS_ACCESS_KEY` in `js/main.js` with a client-specific key from the Web3Forms dashboard
- [ ] Update `input[name="access_key"]` in `index.html` to match
- [ ] Add the live domain to Web3Forms allowed origins
- [ ] Update `robots.txt` sitemap URL to the live domain
- [ ] Enable Gallery and/or Testimonials sections in `index.html` once content is ready (currently commented out)
- [ ] Replace `apple-touch-icon.png` with a 180×180 branded PNG

---

## Client Info

| Field | Value |
|---|---|
| Business | Paint Creek Landscaping |
| Phone | (248) 555-0199 |
| Email | hello@paintcreeklandscaping.com |
| Address | 415 Main St, Rochester, MI 48307 |
| Domain | paintcreeklandscaping.com |
| Founded | 2018 |
| Service area | Rochester & Oakland County |

---

## Brand Colors

```css
--color-primary:      #15803d;
--color-primary-dark: #166534;
--color-accent:       #b45309;
--color-accent-dark:  #92400e;
```

---

## File Structure

```
paintcreek-site-demo/
├── index.html              ← Homepage
├── page-template.html      ← Starter for inner pages
├── 404.html                ← Custom error page
├── robots.txt
├── favicon.svg
├── apple-touch-icon.png
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── og-image.jpg        ← Replace with real 1200×630 image
└── vercel.json
```
