/**
 * Theme mode utilities — extracted from the legacy UserSettingsModal so the
 * shell (src/App.jsx) can configure the active theme without depending on
 * the deleted modal source. Mirrors the original storage contract.
 */

const THEME_MODE_KEY = 'hush_theme_mode';
const DARK_THEME_KEY = 'hush_dark_theme';
const LIGHT_THEME_KEY = 'hush_light_theme';

const DARK_THEMES = [
  { key: 'og-dark', label: 'Dark', css: 'dark' },
];

const LIGHT_THEMES = [
  { key: 'og-light', label: 'Light', css: 'light' },
];

function getStoredDarkTheme() {
  return localStorage.getItem(DARK_THEME_KEY) || 'og-dark';
}

function getStoredLightTheme() {
  return localStorage.getItem(LIGHT_THEME_KEY) || 'og-light';
}

function findThemeCss(key, themes, fallback) {
  const found = themes.find((t) => t.key === key);
  return found ? found.css : fallback;
}

function resolveActiveThemeCss(mode) {
  if (mode === 'light') {
    return findThemeCss(getStoredLightTheme(), LIGHT_THEMES, 'light');
  }
  if (mode === 'dark') {
    return findThemeCss(getStoredDarkTheme(), DARK_THEMES, 'dark');
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark
    ? findThemeCss(getStoredDarkTheme(), DARK_THEMES, 'dark')
    : findThemeCss(getStoredLightTheme(), LIGHT_THEMES, 'light');
}

export function getStoredThemeMode() {
  return localStorage.getItem(THEME_MODE_KEY) || 'system';
}

export function applyThemeMode(mode) {
  localStorage.setItem(THEME_MODE_KEY, mode);
  document.documentElement.dataset.theme = resolveActiveThemeCss(mode);
}

export { DARK_THEMES, LIGHT_THEMES };
