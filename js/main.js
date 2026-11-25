import { initI18n, t } from './i18n/i18n.js';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- theme ----------
   The initial theme is applied by the inline script in <head> (before
   first paint, to avoid a light flash). Here we only handle the toggle. */
const THEME_KEY = 'sad-theme';
const themeBtn = document.getElementById('theme');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode */ }
  });
}

/* ---------- mobile menu ---------- */
const burger = document.getElementById('burger');
const mobnav = document.getElementById('mobnav');
function setMenu(open) {
  mobnav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', t(open ? 'common.menu_close_aria' : 'common.menu_aria'));
  burger.textContent = open ? '×' : '≡';
}
if (burger && mobnav) {
  burger.addEventListener('click', () => setMenu(!mobnav.classList.contains('open')));
  mobnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobnav.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
}

/* ---------- screenshot frames: show the placeholder while the image is missing ---------- */
document.querySelectorAll('.media[data-placeholder] img').forEach(img => {
  const fail = () => img.parentNode.classList.add('empty');
  img.addEventListener('error', fail);
  if (img.complete && img.naturalWidth === 0) fail();
});

/* ---------- nav border on scroll (rAF-throttled, passive) ---------- */
const nav = document.getElementById('nav');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { nav.classList.toggle('stuck', scrollY > 10); ticking = false; });
}, { passive: true });

/* ---------- reveal on scroll — once per element ---------- */
const reveals = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

/* ---------- HUD (section indicator) + current nav link ----------
   Derived from the DOM so numbers never drift from the section heads:
   the hero is "00", every other section reads its own .secnum/.secname.
   The same observer marks the matching nav link with aria-current. */
const hud = document.getElementById('hud');
const hero = document.querySelector('header.hero');
const sections = [hero, ...document.querySelectorAll('main section[id]')].filter(Boolean);
const total = String(sections.length - 1).padStart(2, '0');
let active = hero;

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
function markNav() {
  navLinks.forEach(a => {
    if (a.getAttribute('href') === '#' + active.id) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
}

function renderHud() {
  if (!hud || !active) return;
  const num = active === hero ? '00' : active.querySelector('.secnum')?.textContent.trim();
  const name = active === hero ? t(hero.dataset.hudKey) : active.querySelector('.secname')?.textContent.trim();
  hud.innerHTML = `SEC <b>${num}</b> / ${total} · ${name}`;
}

if ('IntersectionObserver' in window) {
  const so = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { active = e.target; renderHud(); markNav(); } });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(el => so.observe(el));
}
document.addEventListener('langchange', () => {
  renderHud();
  // i18n resets aria-label to the "open" text; keep it truthful if the menu is open
  if (burger && mobnav?.classList.contains('open')) burger.setAttribute('aria-label', t('common.menu_close_aria'));
});

/* ---------- footer year ---------- */
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ---------- i18n (last, so the HUD hears the first langchange) ---------- */
initI18n();
