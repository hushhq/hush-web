/**
 * Global setup for Vitest. Mocks or stubs used across tests.
 */
import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// jsdom does not implement window.matchMedia. Several shadcn primitives
// (e.g. `useIsMobile` inside `Sidebar`) call it during mount. Provide a
// minimal stub that reports a non-matching desktop viewport.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
