import { describe, expect, it } from 'vitest';
import {
  AUTH_INVALIDATION_REASONS,
  AUTH_LIFECYCLE_ACTIONS,
  VAULT_STATES,
  normalizeAuthInvalidationReason,
  planInvalidatedSession,
  planNoTokenStartup,
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

  it('allows PIN unlock when no revoked-device tombstone exists', () => {
    expect(planVaultUnlockAttempt({
      reason: AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID,
    })).toEqual({
      action: AUTH_LIFECYCLE_ACTIONS.UNLOCK_LOCAL_VAULT,
      shouldDestroyLocalDeviceState: false,
      reason: null,
    });
  });
});
