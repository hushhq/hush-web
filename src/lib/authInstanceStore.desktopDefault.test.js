/**
 * Desktop-aware defaulting + persistence semantics for authInstanceStore.
 *
 * The desktop app marks itself via `window.hushDesktop.isDesktop === true`
 * (set by the Electron preload bridge before the renderer module graph
 * evaluates). When that marker is present, the default auth instance must
 * resolve to the hosted URL regardless of the packaged renderer's origin
 * (e.g. `app://localhost`). User overrides written to localStorage must be
 * preserved across reloads.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const HOSTED = 'https://app.gethush.live';

function deleteAuthInstanceDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('hush-auth-instances');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

async function loadModuleWithDesktop(isDesktop) {
  vi.resetModules();
  if (isDesktop) {
    Object.defineProperty(window, 'hushDesktop', {
      value: { isDesktop: true, platform: 'darwin' },
      configurable: true,
      writable: true,
    });
  } else if ('hushDesktop' in window) {
    delete window.hushDesktop;
  }
  return import('./authInstanceStore.js');
}

describe('authInstanceStore desktop defaulting + persistence', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await deleteAuthInstanceDb();
  });

  afterEach(() => {
    if ('hushDesktop' in window) {
      delete window.hushDesktop;
    }
  });

  it('defaults to the hosted instance when running in desktop runtime', async () => {
    const mod = await loadModuleWithDesktop(true);
    expect(mod.DEFAULT_AUTH_INSTANCE_URL).toBe(HOSTED);
    expect(mod.getSelectedAuthInstanceUrlSync()).toBe(HOSTED);
    expect(mod.getActiveAuthInstanceUrlSync()).toBe(HOSTED);
  });

  it('falls back to the renderer origin in browser runtime when not on gethush.live', async () => {
    // jsdom defaults window.location to http://localhost/.
    const mod = await loadModuleWithDesktop(false);
    expect(mod.DEFAULT_AUTH_INSTANCE_URL).toBe('http://localhost:3000');
  });

  it('persists user override across simulated relaunch in desktop runtime', async () => {
    // First launch: user changes the selected instance.
    const first = await loadModuleWithDesktop(true);
    await first.selectAuthInstance('https://chat.example.com');
    expect(first.getSelectedAuthInstanceUrlSync()).toBe('https://chat.example.com');

    // Second launch: localStorage survives, sessionStorage does not.
    sessionStorage.clear();
    const second = await loadModuleWithDesktop(true);
    expect(second.getSelectedAuthInstanceUrlSync()).toBe('https://chat.example.com');
    expect(second.getActiveAuthInstanceUrlSync()).toBe('https://chat.example.com');
  });

  it('preserves an explicit hosted selection in browser runtime', async () => {
    const first = await loadModuleWithDesktop(false);
    await first.selectAuthInstance(HOSTED);
    expect(first.getSelectedAuthInstanceUrlSync()).toBe(HOSTED);

    sessionStorage.clear();
    const second = await loadModuleWithDesktop(false);
    expect(second.getSelectedAuthInstanceUrlSync()).toBe(HOSTED);
  });

  it('returns hosted default after relaunch when user never overrode', async () => {
    await loadModuleWithDesktop(true);
    sessionStorage.clear();
    const second = await loadModuleWithDesktop(true);
    expect(second.getSelectedAuthInstanceUrlSync()).toBe(HOSTED);
  });

  it('preserves an explicit selection when DEFAULT_MIGRATION_KEY is absent', async () => {
    // Simulate stale storage from a session that pre-dates the explicit
    // selection migration mark. The selected value must still be treated as
    // a user choice, not as a legacy default to overwrite.
    localStorage.setItem('hush_auth_instance_selected', HOSTED);
    // No DEFAULT_MIGRATION_KEY set.

    const mod = await loadModuleWithDesktop(false);
    expect(mod.DEFAULT_AUTH_INSTANCE_URL).toBe('http://localhost:3000');
    expect(mod.getSelectedAuthInstanceUrlSync()).toBe(HOSTED);
  });
});
