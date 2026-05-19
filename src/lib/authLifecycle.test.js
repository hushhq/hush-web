import { describe, expect, it } from 'vitest';
import {
  AUTH_INVALIDATION_REASONS,
  AUTH_LIFECYCLE_ACTIONS,
  LOCAL_AUTH_RESET_REASONS,
  VAULT_STATES,
  normalizeAuthInvalidationReason,
  planInvalidatedSession,
  planLocalAuthReset,
  planLocalVaultLock,
  planNoTokenStartup,
  planPinFailure,
  planVaultUnlockAttempt,
} from './authLifecycle';

describe('authLifecycle', () => {
  it('normalizes unknown invalidation reasons to recoverable server invalidation', () => {
    expect(normalizeAuthInvalidationReason('network_stale')).toBe(
      AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    );
  });

  it('normalizes empty invalidation reasons to recoverable server invalidation', () => {
    expect(normalizeAuthInvalidationReason(null)).toBe(
      AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    );
    expect(normalizeAuthInvalidationReason('')).toBe(
      AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    );
  });

  it('plans destructive boot when a revoked-device tombstone exists', () => {
    const plan = planNoTokenStartup({
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    });

    expect(plan).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.DESTROY_REVOKED_DEVICE_STATE,
      shouldDestroyLocalDeviceState: true,
      shouldContinueVaultDiscovery: false,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
    });
  });

  it('allows normal vault discovery when no revoked-device tombstone exists', () => {
    const plan = planNoTokenStartup({
      reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    });

    expect(plan.shouldDestroyLocalDeviceState).toBe(false);
    expect(plan.shouldContinueVaultDiscovery).toBe(true);
    expect(plan.nextVaultState).toBeNull();
  });

  it('keeps a recoverable local vault locked after generic session invalidation', () => {
    const plan = planInvalidatedSession(
      AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
      { hasRecoverableVault: true },
    );

    expect(plan).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.INVALIDATE_SERVER_SESSION,
      reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
      shouldDestroyLocalDeviceState: false,
      shouldPersistInvalidation: true,
      nextVaultState: VAULT_STATES.LOCKED,
      nextHasLocalVault: true,
    });
  });

  it('destroys local device state after device revocation', () => {
    const plan = planInvalidatedSession(
      AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
      { hasRecoverableVault: true },
    );

    expect(plan).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.DESTROY_REVOKED_DEVICE_STATE,
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
      shouldDestroyLocalDeviceState: true,
      shouldPersistInvalidation: true,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
    });
  });

  it('blocks PIN unlock when a revoked-device tombstone exists', () => {
    expect(planVaultUnlockAttempt({
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    })).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.BLOCK_REVOKED_DEVICE_UNLOCK,
      shouldDestroyLocalDeviceState: true,
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    });
  });

  it('blocks PIN unlock when any invalidation source reports device revocation', () => {
    expect(
      planVaultUnlockAttempt(
        { reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID },
        { reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED },
      ),
    ).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.BLOCK_REVOKED_DEVICE_UNLOCK,
      shouldDestroyLocalDeviceState: true,
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    });

    expect(
      planVaultUnlockAttempt(
        { reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED },
        { reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID },
      ),
    ).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.BLOCK_REVOKED_DEVICE_UNLOCK,
      shouldDestroyLocalDeviceState: true,
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    });
  });

  it('allows PIN unlock when no revoked-device tombstone exists', () => {
    expect(planVaultUnlockAttempt({
      reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    })).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.UNLOCK_LOCAL_VAULT,
      shouldDestroyLocalDeviceState: false,
      reason: null,
    });
  });

  it('plans a local vault lock without destructive local state changes', () => {
    expect(planLocalVaultLock()).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.LOCK_LOCAL_VAULT,
      shouldClearIdentity: true,
      shouldClearSessionKeys: true,
      shouldClearTranscriptCache: true,
      nextVaultState: VAULT_STATES.LOCKED,
    });
  });

  it('plans wrong-PIN rejection before the failure threshold', () => {
    expect(planPinFailure({ chargedCount: 3, maxFailures: 10 })).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.REJECT_WRONG_PIN,
      shouldWipeLocalVault: false,
      shouldClearSession: false,
      nextVaultState: null,
      nextHasLocalVault: null,
      remainingAttempts: 7,
      errorCode: 'WRONG_PIN',
      errorMessage: 'incorrect PIN (7 attempts remaining)',
    });
  });

  it('plans local vault wipe at the PIN failure threshold', () => {
    expect(planPinFailure({ chargedCount: 10, maxFailures: 10 })).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.WIPE_LOCAL_VAULT_AFTER_PIN_FAILURES,
      shouldWipeLocalVault: true,
      shouldClearSession: true,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
      remainingAttempts: 0,
      errorCode: 'VAULT_WIPED',
      errorMessage: 'vault wiped after too many failed PIN attempts',
    });
  });

  it('rejects invalid PIN failure counters', () => {
    expect(() => planPinFailure({ chargedCount: -1, maxFailures: 10 })).toThrow(TypeError);
    expect(() => planPinFailure({ chargedCount: 1, maxFailures: 0 })).toThrow(TypeError);
  });

  it('plans a full local auth reset', () => {
    expect(planLocalAuthReset(LOCAL_AUTH_RESET_REASONS.LOGOUT)).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.RESET_LOCAL_AUTH_STATE,
      reason: LOCAL_AUTH_RESET_REASONS.LOGOUT,
      shouldClearIdentity: true,
      nextToken: null,
      nextUser: null,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
      nextNeedsPinSetup: false,
      nextIsGuest: false,
      nextGuestExpiresAt: null,
      nextError: null,
      nextLoading: false,
      shouldClearAuthQueries: true,
      shouldClearGuestTimers: true,
      shouldClearPinSetupStorage: true,
      shouldClearSession: false,
      shouldClearTranscriptCache: true,
      shouldClearVaultTimeoutEffects: true,
    });
  });

  it('plans broadcast logout without destructive local transcript cleanup', () => {
    expect(planLocalAuthReset(LOCAL_AUTH_RESET_REASONS.BROADCAST_LOGOUT)).toMatchObject({
      reason: LOCAL_AUTH_RESET_REASONS.BROADCAST_LOGOUT,
      nextLoading: null,
      shouldClearAuthQueries: true,
      shouldClearGuestTimers: true,
      shouldClearSession: true,
      shouldClearTranscriptCache: false,
      shouldClearVaultTimeoutEffects: true,
    });
  });

  it('plans revoked-device reset with destructive local cleanup', () => {
    expect(planLocalAuthReset(LOCAL_AUTH_RESET_REASONS.DEVICE_REVOKED)).toMatchObject({
      reason: LOCAL_AUTH_RESET_REASONS.DEVICE_REVOKED,
      nextLoading: null,
      shouldClearAuthQueries: true,
      shouldClearGuestTimers: true,
      shouldClearSession: true,
      shouldClearTranscriptCache: true,
      shouldClearVaultTimeoutEffects: true,
    });
  });

  it('rejects unknown local auth reset reasons', () => {
    expect(() => planLocalAuthReset('logoff')).toThrow(TypeError);
  });
});
