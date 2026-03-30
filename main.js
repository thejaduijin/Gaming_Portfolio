/* ═══════════════════════════════════════════════
   LOKENDRA — SLOT GAME DEVELOPER PORTFOLIO
   main.js
═══════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ───────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursorDot');
  if (!dot) return;

  document.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
  });
}

/* ── SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ── ACTIVE NAV HIGHLIGHT ────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 200) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.color =
        link.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
    });
  });
}

/* ── SLOT REEL RE-SPIN ON LOGO CLICK ─────────── */
function initReelRespin() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  logo.addEventListener('click', () => {
    const reelInners = document.querySelectorAll('.reel-inner');

    reelInners.forEach((reel) => {
      // Remove animation, force reflow, re-apply
      reel.style.animation = 'none';
      void reel.offsetHeight; // trigger reflow
      reel.style.animation = '';
    });
  });
}

/* ── CONTACT FORM — Formspree ────────────────────
   HOW TO ACTIVATE:
   1. Go to https://formspree.io and sign up (free)
   2. Click "New Form" → name it "Portfolio Contact"
   3. Copy your endpoint — looks like:
      https://formspree.io/f/xxxxxxxx
   4. Paste it as the value of FORMSPREE_ENDPOINT below
─────────────────────────────────────────────── */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/maqlqgrz'; // ← swap this

function initContactForm() {
  const btn      = document.getElementById('formSubmit');
  const status   = document.getElementById('formStatus');
  const nameEl   = document.getElementById('fieldName');
  const companyEl= document.getElementById('fieldCompany');
  const emailEl  = document.getElementById('fieldEmail');
  const msgEl    = document.getElementById('fieldMessage');

  if (!btn || !status || !nameEl || !emailEl || !msgEl) return;

  btn.addEventListener('click', async () => {
    // ── Basic validation ──
    const name    = nameEl.value.trim();
    const company = companyEl ? companyEl.value.trim() : '';
    const email   = emailEl.value.trim();
    const message = msgEl.value.trim();

    if (!name || !email || !message) {
      setStatus('error', '✕  Please fill in your name, email, and message.');
      return;
    }

    if (!isValidEmail(email)) {
      setStatus('error', '✕  Please enter a valid email address.');
      return;
    }

    // ── Guard: endpoint not yet configured ──
    if (FORMSPREE_ENDPOINT.includes('maqlqgrz')) {
      setStatus('error', '✕  Form not connected yet — see setup instructions in main.js.');
      return;
    }

    // ── Loading state ──
    setLoading(true);
    setStatus('', '');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, company, email, message }),
      });

      if (res.ok) {
        // ── Success ──
        setStatus('success', '✦  Message sent! I\'ll get back to you soon.');
        resetForm(nameEl, companyEl, emailEl, msgEl);
      } else {
        const data = await res.json().catch(() => ({}));
        const errMsg = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        setStatus('error', '✕  ' + errMsg);
      }
    } catch (_) {
      setStatus('error', '✕  Network error — check your connection and try again.');
    } finally {
      setLoading(false);
    }
  });

  /* ── Helpers ── */
  function setLoading(on) {
    btn.disabled = on;
    btn.textContent = on ? 'Sending…' : 'Send Message →';
    btn.style.opacity = on ? '0.7' : '';
    btn.style.cursor  = on ? 'not-allowed' : '';
  }

  function setStatus(type, text) {
    status.textContent = text;
    status.className   = 'form-status' + (type ? ' form-status--' + type : '');
  }

  function resetForm(...fields) {
    fields.forEach((f) => { if (f) f.value = ''; });
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }
}

/* ── INIT ALL ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScrollReveal();
  initActiveNav();
  initReelRespin();
  initContactForm();
});