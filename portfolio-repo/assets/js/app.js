/* ========= Mobile Menu ========= */
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu   = document.querySelector('[data-nav-menu]');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('is-open'));
  });

  // Close menu when a link is clicked (helpful on mobile)
  navMenu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('is-open'));
  });
}

/* ========= Smooth Scroll & Active Link ========= */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('a[href^="#"]');

function smoothScroll(e) {
  const href = this.getAttribute('href');
  if (href.startsWith('#')) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
  }
}
navLinks.forEach(link => link.addEventListener('click', smoothScroll));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`nav a[href="#${id}"]`);
    if (link) {
      if (entry.isIntersecting) {
        document.querySelectorAll('nav a.is-active').forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    }
  });
}, { root: null, rootMargin: '0px 0px -65% 0px', threshold: 0 });

sections.forEach(sec => observer.observe(sec));

/* ========= Sticky Header Shadow ========= */
const header = document.querySelector('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  });
}

/* ========= Theme Toggle (Light/Dark) ========= */
const themeToggle = document.querySelector('[data-theme-toggle]');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
if (themeToggle) {
  const saved = localStorage.getItem('theme');
  applyTheme(saved || (prefersDark ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

/* ========= Lightbox (Modal Image Gallery) ========= */
const galleryImgs = document.querySelectorAll('.gallery img');

if (galleryImgs.length) {
  const modal = document.createElement('div');
  modal.className = 'lightbox';
  modal.innerHTML = `
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <img class="lightbox__img" alt="">
    <p class="lightbox__cap"></p>
  `;
  document.body.appendChild(modal);
  const modalImg = modal.querySelector('.lightbox__img');
  const modalCap = modal.querySelector('.lightbox__cap');
  const closeBtn = modal.querySelector('.lightbox__close');

  function openLightbox(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt || '';
    modalCap.textContent = alt || '';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    modalImg.src = '';
  }
  galleryImgs.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ========= Contact Form Validation ========= */
const form = document.getElementById('contact-form');
if (form) {
  const statusEl = document.createElement('p');
  statusEl.className = 'form-status';
  form.appendChild(statusEl);

  form.addEventListener('submit', (e) => {
    const name  = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const msg   = form.querySelector('[name="message"]');

    let errors = [];
    if (!name || !name.value.trim()) errors.push('Name is required.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errors.push('A valid email is required.');
    if (!msg || msg.value.trim().length < 10) errors.push('Message must be at least 10 characters.');

    if (errors.length) {
      e.preventDefault();
      statusEl.textContent = errors.join(' ');
      statusEl.setAttribute('aria-live', 'polite');
      statusEl.classList.remove('ok');
      statusEl.classList.add('error');
    } else {
      statusEl.textContent = 'Thanks! Your message looks good.';
      statusEl.classList.remove('error');
      statusEl.classList.add('ok');
      // allow normal submit or hook fetch() here
    }
  });
}
