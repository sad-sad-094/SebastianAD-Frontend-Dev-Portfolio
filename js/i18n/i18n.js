import { es } from './es.js';
import { en } from './en.js';

const LANGS = { es, en };
const STORAGE_KEY = 'portfolio-lang';
const DEFAULT_LANG = 'es';

function getInitialLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && LANGS[stored]) return stored;
  const browser = navigator.language.slice(0, 2);
  return LANGS[browser] ? browser : DEFAULT_LANG;
}

function applyLang(lang) {
  const t = LANGS[lang];

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
  });

  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const key = el.dataset.i18nContent;
    if (t[key] !== undefined) el.setAttribute('content', t[key]);
  });

  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    const next = lang === 'es' ? 'en' : 'es';
    btn.dataset.langNext = next;
    btn.querySelector('.nav__lang-label').textContent = t['nav.lang_label'];
    btn.setAttribute('aria-label', t['nav.lang_aria']);
  });
}

export function initI18n() {
  const lang = getInitialLang();
  applyLang(lang);
  localStorage.setItem(STORAGE_KEY, lang);

  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.langNext;
      applyLang(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
}
