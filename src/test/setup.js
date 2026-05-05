/**
 * Global setup for Vitest. Mocks or stubs used across tests.
 */
import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

// jsdom does not implement ResizeObserver, but several shadcn primitives
// (input-otp, scroll-area, etc.) instantiate one at mount and will throw
// "ResizeObserver is not defined" without this stub. The observer never
// has to fire — most tests assert against the initial render — so a
// no-op implementation is enough.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom does not implement document.elementFromPoint. The `input-otp`
// component schedules a setTimeout that calls it for caret/selection
// alignment, so without a stub the test run reports "Uncaught Exception:
// document.elementFromPoint is not a function" even though every test
// passes. A no-op return matches the runtime semantics for jsdom (no real
// hit-testing) and quiets the unhandled-rejection noise.
if (typeof document !== 'undefined' && typeof document.elementFromPoint !== 'function') {
  document.elementFromPoint = () => null;
}

// jsdom does not implement window.matchMedia. shadcn's SidebarProvider
// reads it on mount to detect the mobile breakpoint, so any test that
// renders SidebarProvider (system-channel-view, channel-sidebar, etc.)
// trips a "matchMedia is not a function" without this stub. A query-
// shape mock is enough — no test asserts against the result.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
