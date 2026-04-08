// Kontaktformular Modal
const overlay   = document.getElementById('modalOverlay');
const openBtn   = document.getElementById('openForm');
const closeBtn  = document.getElementById('closeForm');

openBtn.addEventListener('click', () => {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

// Impressum Modal
const impressumOverlay  = document.getElementById('impressumOverlay');
const openImpressum     = document.getElementById('openImpressum');
const closeImpressum    = document.getElementById('closeImpressum');

openImpressum.addEventListener('click', () => {
  impressumOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeImpressumModal() {
  impressumOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

closeImpressum.addEventListener('click', closeImpressumModal);

impressumOverlay.addEventListener('click', (e) => {
  if (e.target === impressumOverlay) closeImpressumModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeImpressumModal();
    closeDatenschutzModal();
  }
});

// Datenschutz Modal
const datenschutzOverlay = document.getElementById('datenschutzOverlay');
const openDatenschutz    = document.getElementById('openDatenschutz');
const closeDatenschutz   = document.getElementById('closeDatenschutz');

openDatenschutz.addEventListener('click', () => {
  datenschutzOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeDatenschutzModal() {
  datenschutzOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

closeDatenschutz.addEventListener('click', closeDatenschutzModal);

datenschutzOverlay.addEventListener('click', (e) => {
  if (e.target === datenschutzOverlay) closeDatenschutzModal();
});

// Datenschutz-Link in Formularen
document.getElementById('openDatenschutzFromForm')?.addEventListener('click', () => {
  datenschutzOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.getElementById('openDatenschutzFromStepper')?.addEventListener('click', () => {
  datenschutzOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});

// Mobile Sticky Nav
const nav = document.querySelector('nav');
let navOffsetTop = 0;

function setupStickyNav() {
  if (window.innerWidth > 900) {
    nav.classList.remove('nav-fixed');
    document.body.classList.remove('nav-is-fixed');
    return;
  }
  nav.classList.remove('nav-fixed');
  document.body.classList.remove('nav-is-fixed');
  navOffsetTop = nav.getBoundingClientRect().top + window.scrollY;
}

function onStickyNavScroll() {
  if (window.innerWidth > 900) return;
  if (window.scrollY >= navOffsetTop) {
    nav.classList.add('nav-fixed');
    document.body.classList.add('nav-is-fixed');
  } else {
    nav.classList.remove('nav-fixed');
    document.body.classList.remove('nav-is-fixed');
  }
}

window.addEventListener('scroll', onStickyNavScroll, { passive: true });
window.addEventListener('resize', setupStickyNav);
setupStickyNav();

// Scroll Arrow
const scrollArrow = document.getElementById('scrollArrow');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    scrollArrow.classList.add('hidden');
  } else {
    scrollArrow.classList.remove('hidden');
  }
}, { passive: true });

// Active Nav Highlight
const sections = document.querySelectorAll('header.hero, section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionNavMap = {
  'top':        'top',
  'leistungen': 'leistungen',
  'anlaesse':   'leistungen',
  'vorteile':   'leistungen',
  'ueber-mich': 'ueber-mich',
  'faq':        'faq',
  'kontakt':    'kontakt'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id || 'top';
    const activeNav = sectionNavMap[id] ?? id;
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeNav) link.classList.add('active');
    });
  });
}, {
  threshold: 0.4
});

sections.forEach(s => sectionObserver.observe(s));

// Scroll-Reveal
const items = document.querySelectorAll('.reveal-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0,
  rootMargin: '0px 0px -80px 0px'
});

items.forEach(el => observer.observe(el));
