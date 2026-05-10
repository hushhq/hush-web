import { describe, it, expect, beforeEach } from 'vitest';
import { HOME_INSTANCE_KEY, resolveReauthInstanceUrl } from './reauthInstance';

const ACTIVE_INSTANCE_KEY = 'hush_auth_instance_active';

describe('resolveReauthInstanceUrl', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('returns active instance when sessionStorage has one set', () => {
    sessionStorage.setItem(ACTIVE_INSTANCE_KEY, 'https://chat.example.com');
    localStorage.setItem(HOME_INSTANCE_KEY, 'https://home.example.com');
    expect(resolveReauthInstanceUrl()).toBe('https://chat.example.com');
  });

  it('falls back to home instance when no active is set', () => {
    localStorage.setItem(HOME_INSTANCE_KEY, 'https://home.example.com');
    expect(resolveReauthInstanceUrl()).toBe('https://home.example.com');
  });

  it('returns empty string when neither is set', () => {
    expect(resolveReauthInstanceUrl()).toBe('');
  });

  it('does not fall through to default selected instance', () => {
    // Selected key is set but neither active nor home — must not pick
    // up the default selection (that path is owned by performInitialAuth,
    // not unlock re-auth).
    localStorage.setItem('hush_auth_instance_selected', 'https://default.example.com');
    expect(resolveReauthInstanceUrl()).toBe('');
  });

  it('normalizes the active instance origin', () => {
    sessionStorage.setItem(ACTIVE_INSTANCE_KEY, 'https://chat.example.com/some/path?q=1');
    expect(resolveReauthInstanceUrl()).toBe('https://chat.example.com');
  });
});
