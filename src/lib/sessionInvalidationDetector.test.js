import { describe, it, expect } from 'vitest';
import { detectSessionInvalidation } from './sessionInvalidationDetector';

describe('detectSessionInvalidation', () => {
  describe('structured error_code', () => {
    it('returns device_revoked for DEVICE_REVOKED on any path', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/servers/abc/messages',
          body: { error_code: 'DEVICE_REVOKED' },
        }),
      ).toEqual({ reason: 'device_revoked' });
    });

    it('returns server_session_invalid for USER_NOT_FOUND on any path', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/servers/abc/members',
          body: { error_code: 'USER_NOT_FOUND' },
        }),
      ).toEqual({ reason: 'server_session_invalid' });
    });

    it('accepts lowercased error_code', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/auth/me',
          body: { error_code: 'session_invalid' },
        }),
      ).toEqual({ reason: 'server_session_invalid' });
    });

    it('ignores unknown error_code values', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/auth/me',
          body: { error_code: 'RATE_LIMITED' },
        }),
      ).toBeNull();
    });
  });

  describe('string-match fallback', () => {
    it('fires on auth path with device revoked string', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/auth/me',
          body: { error: 'device revoked' },
        }),
      ).toEqual({ reason: 'device_revoked' });
    });

    it('fires on /api/me with user not found string', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/me',
          body: { error: 'user not found' },
        }),
      ).toEqual({ reason: 'server_session_invalid' });
    });

    it('fires on /api/livekit/token with session invalid string', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/livekit/token',
          body: { error: 'session invalid' },
        }),
      ).toEqual({ reason: 'server_session_invalid' });
    });

    it('does NOT fire on product path even with matching string', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/servers/abc/members/lookup',
          body: { error: 'user not found' },
        }),
      ).toBeNull();
    });

    it('does NOT fire on generic 401 (expired session) on auth path', () => {
      expect(
        detectSessionInvalidation({
          path: '/api/auth/me',
          body: { error: 'session not found or expired' },
        }),
      ).toBeNull();
    });
  });

  describe('input edge cases', () => {
    it('returns null on missing path', () => {
      expect(detectSessionInvalidation({ path: '', body: { error: 'device revoked' } })).toBeNull();
    });

    it('returns null on null body', () => {
      expect(detectSessionInvalidation({ path: '/api/auth/me', body: null })).toBeNull();
    });

    it('returns null on non-object body', () => {
      expect(detectSessionInvalidation({ path: '/api/auth/me', body: 'string' })).toBeNull();
    });
  });
});
