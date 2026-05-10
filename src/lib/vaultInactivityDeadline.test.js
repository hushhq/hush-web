import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearPersistedInactivityDeadline,
  getVaultIdleDeadlineStorageKey,
  persistInactivityDeadline,
  readPersistedInactivityDeadline,
  shouldBlockNumericVaultSessionResume,
} from './vaultInactivityDeadline';

describe('vaultInactivityDeadline', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('stores numeric deadlines in session and user-scoped local storage', () => {
    persistInactivityDeadline('user-1', 1234);

    expect(sessionStorage.getItem('hush_vault_idle_deadline')).toBe('1234');
    expect(localStorage.getItem(getVaultIdleDeadlineStorageKey('user-1'))).toBe('1234');
    expect(readPersistedInactivityDeadline('user-1')).toBe(1234);
  });

  it('survives a closed-tab sessionStorage wipe via localStorage', () => {
    persistInactivityDeadline('user-1', 5678);
    sessionStorage.clear();

    expect(readPersistedInactivityDeadline('user-1')).toBe(5678);
  });

  it('clears corrupt deadline values from both stores', () => {
    sessionStorage.setItem('hush_vault_idle_deadline', 'bad');
    localStorage.setItem(getVaultIdleDeadlineStorageKey('user-1'), 'bad');

    expect(readPersistedInactivityDeadline('user-1')).toBeNull();
    expect(sessionStorage.getItem('hush_vault_idle_deadline')).toBeNull();
    expect(localStorage.getItem(getVaultIdleDeadlineStorageKey('user-1'))).toBeNull();
  });

  it('clears the legacy session key and the user-scoped local key', () => {
    persistInactivityDeadline('user-1', 9999);
    clearPersistedInactivityDeadline('user-1');

    expect(readPersistedInactivityDeadline('user-1')).toBeNull();
  });

  it('blocks numeric session resume when the persisted deadline is missing or expired', () => {
    expect(shouldBlockNumericVaultSessionResume('user-1', 5, 1000)).toBe(true);
    persistInactivityDeadline('user-1', 999);
    expect(shouldBlockNumericVaultSessionResume('user-1', 5, 1000)).toBe(true);
    persistInactivityDeadline('user-1', 1001);
    expect(shouldBlockNumericVaultSessionResume('user-1', 5, 1000)).toBe(false);
    expect(shouldBlockNumericVaultSessionResume('user-1', 'never', 1000)).toBe(false);
  });
});
