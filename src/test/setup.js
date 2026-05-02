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

// jsdom does not implement ResizeObserver. Radix Popper (used by
// Tooltip / Popover / DropdownMenu / Select) measures its anchor with
// it. Provide a no-op shim so vanilla shadcn primitives mount in tests.
if (typeof globalThis !== 'undefined' && typeof globalThis.ResizeObserver !== 'function') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
