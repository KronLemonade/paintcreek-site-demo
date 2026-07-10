/* ============================================================
   CONFIGURATION — update these per client
   ============================================================ */
const WEB3FORMS_ACCESS_KEY = 'a2c9c6ad-5d52-4434-b8cf-3993351ce24d';

/* ============================================================
   FONT LOADING — activates the preloaded Google Fonts stylesheet
   without an inline onload attribute (CSP-safe)
   ============================================================ */
(function loadFonts() {
  var link = document.getElementById('google-fonts');
  if (link) link.rel = 'stylesheet';
}());

/* ============================================================
   CANONICAL URL — injects self-referencing canonical so the
   tag is always correct on any domain without manual edits.
   In production you may replace this with a static <link> in <head>.
   ============================================================ */
(function setCanonical() {
  if (document.querySelector('link[rel="canonical"]')) return;
  var link = document.createElement('link');
  link.rel = 'canonical';
  link.href = window.location.origin + window.location.pathname;
  document.head.appendChild(link);
}());

/* ============================================================
   MOBILE NAV
   ============================================================ */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.classList.toggle('is-open', !isOpen);
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
      hamburger.focus();
    }
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    });
  });
}());

/* ============================================================
   COPYRIGHT YEAR
   ============================================================ */
(function setYear() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
}());

/* ============================================================
   CONTACT FORM — Web3Forms + honeypot
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const result = document.getElementById('form-result');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form || !result) return;

  // Inject access key so it's driven by the constant above
  const keyInput = form.querySelector('input[name="access_key"]');
  if (keyInput) keyInput.value = WEB3FORMS_ACCESS_KEY;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Reset result
    result.className = '';
    result.style.display = 'none';
    result.removeAttribute('role');

    // Disable button
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const data = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const json = await response.json();

      result.setAttribute('role', 'alert');

      if (response.ok && json.success) {
        result.className = 'success';
        result.textContent = 'Thank you! We received your message and will be in touch shortly.';
        form.reset();
      } else {
        result.className = 'error';
        result.textContent = json.message || 'Something went wrong. Please try again or call us directly.';
      }
    } catch (err) {
      result.setAttribute('role', 'alert');
      result.className = 'error';
      result.textContent = 'Network error. Please check your connection and try again, or call us directly.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}());

/* ============================================================
   SMOOTH SCROLL for anchor links (enhances browser native)
   ============================================================ */
(function smoothScrollAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus to target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}());
