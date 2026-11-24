import { es } from './es.js';
import { en } from './en.js';

const LANGS = { es, en };
const STORAGE_KEY = 'portfolio-lang';
const DEFAULT_LANG = 'es';

let current = DEFAULT_LANG;

function readStored() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

function writeStored(lang) {
  try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ }
}

function getInitialLang() {
  const stored = readStored();
  if (stored && LANGS[stored]) return stored;
  const browser = (navigator.language || '').slice(0, 2);
  return LANGS[browser] ? browser : DEFAULT_LANG;
}

/** Translate a key in the active language (falls back to the key itself). */
export function t(key) {
  const value = LANGS[current][key];
  return value !== undefined ? value : key;
}

function applyLang(lang) {
  const dict = LANGS[lang];
  current = lang;

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.dataset.i18nAlt;
    if (dict[key] !== undefined) el.setAttribute('alt', dict[key]);
  });

  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const key = el.dataset.i18nContent;
    if (dict[key] !== undefined) el.setAttribute('content', dict[key]);
  });

  document.querySelectorAll('[data-i18n-href]').forEach(el => {
    const key = el.dataset.i18nHref;
    if (dict[key] !== undefined) el.setAttribute('href', dict[key]);
  });

  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.dataset.langNext = lang === 'es' ? 'en' : 'es';
    btn.textContent = dict['common.lang_label'];
    btn.setAttribute('aria-label', dict['common.lang_aria']);
  });

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function initI18n() {
  const lang = getInitialLang();
  applyLang(lang);
  writeStored(lang);

  document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.langNext;
      applyLang(next);
      writeStored(next);
    });
  });
}
