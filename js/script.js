/* ============================================
   ICG Engineering Solutions - Main Script
   ============================================ */

// ── Clean URLs: show /index.html as / and /services.html as /services in the address bar ──
// GitHub Pages serves both forms; the canonical tags already point to the clean ones.
if (/\.html$/.test(location.pathname)) {
  const clean = location.pathname.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
  history.replaceState(null, '', clean + location.search + location.hash);
}

document.addEventListener('DOMContentLoaded', () => {

  // ── Header border on scroll ──
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile menu ──
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (menuToggle && nav) {
    const setOpen = (open) => {
      menuToggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    menuToggle.addEventListener('click', () => setOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // ── Project filter ──
  // Buttons carry data-filter; cards carry data-category. The choice is kept in the URL hash
  // so sector links on the home page (projects.html#hotels) open pre-filtered.
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  if (filterBtns.length && projectCards.length) {
    const emptyMsg = document.getElementById('projects-empty');
    const applyFilter = (filter) => {
      let shown = 0;
      filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
    };
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
      applyFilter(btn.dataset.filter);
      history.replaceState(null, '', btn.dataset.filter === 'all' ? location.pathname : '#' + btn.dataset.filter);
    }));
    const fromHash = location.hash.slice(1);
    if ([...filterBtns].some(b => b.dataset.filter === fromHash)) applyFilter(fromHash);
  }

  // ── Services page: highlight the section in view ──
  const indexLinks = document.querySelectorAll('.service-index a');
  if (indexLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map([...indexLinks].map(a => [a.getAttribute('href').slice(1), a]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          indexLinks.forEach(a => a.classList.remove('is-active'));
          byId.get(entry.target.id)?.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
  }

  // ── Contact form: validate, then submit to Formspree without leaving the page ──
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const status = contactForm.querySelector('.form-status');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const fields = contactForm.querySelectorAll('.field input, .field select, .field textarea');

    const validateField = (field) => {
      const wrap = field.closest('.field');
      if (!wrap) return true;
      const value = field.value.trim();
      let valid = !(field.required && !value);
      if (valid && value && field.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (valid && value && field.type === 'tel') valid = /^[\d\s\-+()]{7,20}$/.test(value);
      wrap.classList.toggle('has-error', !valid);
      field.setAttribute('aria-invalid', String(!valid));
      return valid;
    };

    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.field')?.classList.contains('has-error')) validateField(field);
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach(field => { if (!validateField(field) && !firstInvalid) firstInvalid = field; });
      if (firstInvalid) { firstInvalid.focus(); return; }

      const label = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      status.className = 'form-status';
      status.textContent = '';

      try {
        const res = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(String(res.status));
        contactForm.reset();
        status.classList.add('is-success');
        status.textContent = 'Message sent. We will reply within one working day.';
      } catch {
        status.classList.add('is-error');
        status.textContent = 'Your message could not be sent. Please call us on +91 98798 74089 or try again.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    });
  }

  // ── Footer year ──
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});
