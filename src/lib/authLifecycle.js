export const AUTH_INVALIDATION_REASONS = Object.freeze({
  DEVICE_REVOKED: 'device_revoked',
  SERVER_SESSION_INVALID: 'server_session_invalid',
});

export const AUTH_LIFECYCLE_ACTIONS = Object.freeze({
  BLOCK_REVOKED_DEVICE_UNLOCK: 'block_revoked_device_unlock',
  DESTROY_REVOKED_DEVICE_STATE: 'destroy_revoked_device_state',
  DISCOVER_LOCAL_VAULT: 'discover_local_vault',
  INVALIDATE_SERVER_SESSION: 'invalidate_server_session',
  LOCK_LOCAL_VAULT: 'lock_local_vault',
  REJECT_WRONG_PIN: 'reject_wrong_pin',
  RESET_LOCAL_AUTH_STATE: 'reset_local_auth_state',
  UNLOCK_LOCAL_VAULT: 'unlock_local_vault',
  WIPE_LOCAL_VAULT_AFTER_PIN_FAILURES: 'wipe_local_vault_after_pin_failures',
});

export const VAULT_STATES = Object.freeze({
  NONE: 'none',
  LOCKED: 'locked',
});

/**
 * Returns the canonical invalidation reason used by the auth lifecycle.
 *
 * @param {string|undefined|null} reason
 * @returns {string}
 */
export function normalizeAuthInvalidationReason(reason) {
  if (reason === AUTH_INVALIDATION_REASONS.DEVICE_REVOKED) {
    return AUTH_INVALIDATION_REASONS.DEVICE_REVOKED;
  }
  return AUTH_INVALIDATION_REASONS.SERVER_SESSION_INVALID;
}

/**
 * Plans the boot transition when no JWT is present.
 *
 * @param {{ reason?: string }|null|undefined} authInvalidation
 * @returns {{
 *   action: string,
 *   shouldDestroyLocalDeviceState: boolean,
 *   shouldContinueVaultDiscovery: boolean,
 *   nextVaultState: string|null,
 *   nextHasLocalVault: boolean|null,
 * }}
 */
export function planNoTokenStartup(authInvalidation) {
  if (authInvalidation?.reason === AUTH_INVALIDATION_REASONS.DEVICE_REVOKED) {
    return {
      action: AUTH_LIFECYCLE_ACTIONS.DESTROY_REVOKED_DEVICE_STATE,
      shouldDestroyLocalDeviceState: true,
      shouldContinueVaultDiscovery: false,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
    };
  }

  return {
    action: AUTH_LIFECYCLE_ACTIONS.DISCOVER_LOCAL_VAULT,
    shouldDestroyLocalDeviceState: false,
    shouldContinueVaultDiscovery: true,
    nextVaultState: null,
    nextHasLocalVault: null,
  };
}

/**
 * Plans the transition after the active server session becomes invalid.
 *
 * @param {string|undefined|null} reason
 * @param {{ hasRecoverableVault: boolean }} options
 * @returns {{
 *   action: string,
 *   reason: string,
 *   shouldDestroyLocalDeviceState: boolean,
 *   shouldPersistInvalidation: boolean,
 *   nextVaultState: string,
 *   nextHasLocalVault: boolean,
 * }}
 */
export function planInvalidatedSession(reason, { hasRecoverableVault }) {
  const normalizedReason = normalizeAuthInvalidationReason(reason);

  if (normalizedReason === AUTH_INVALIDATION_REASONS.DEVICE_REVOKED) {
    return {
      action: AUTH_LIFECYCLE_ACTIONS.DESTROY_REVOKED_DEVICE_STATE,
      reason: normalizedReason,
      shouldDestroyLocalDeviceState: true,
      shouldPersistInvalidation: true,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
    };
  }

  return {
    action: AUTH_LIFECYCLE_ACTIONS.INVALIDATE_SERVER_SESSION,
    reason: normalizedReason,
    shouldDestroyLocalDeviceState: false,
    shouldPersistInvalidation: true,
    nextVaultState: hasRecoverableVault ? VAULT_STATES.LOCKED : VAULT_STATES.NONE,
    nextHasLocalVault: Boolean(hasRecoverableVault),
  };
}

/**
 * Plans a user-initiated local vault unlock attempt.
 *
 * A revoked-device tombstone is a hard local boundary. Unlocking the vault
 * from that state would let a revoked browser mint a new session from stale
 * IndexedDB data, so the caller must destroy local device state before any PIN
 * verification or challenge-response runs.
 *
 * Any vault-unlock path must call this planner before opening local vault
 * storage. The planner accepts multiple invalidation sources so a revoked
 * signal cannot be hidden by a stale recoverable marker from another source.
 *
 * @param {...({ reason?: string }|null|undefined)} authInvalidations
 * @returns {{
 *   action: string,
 *   shouldDestroyLocalDeviceState: boolean,
 *   reason: string|null,
 * }}
 */
export function planVaultUnlockAttempt(...authInvalidations) {
  const hasRevokedDeviceSignal = authInvalidations.some(
    (authInvalidation) => authInvalidation?.reason === AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
  );

  if (hasRevokedDeviceSignal) {
    return {
      action: AUTH_LIFECYCLE_ACTIONS.BLOCK_REVOKED_DEVICE_UNLOCK,
      shouldDestroyLocalDeviceState: true,
      reason: AUTH_INVALIDATION_REASONS.DEVICE_REVOKED,
    };
  }

  return {
    action: AUTH_LIFECYCLE_ACTIONS.UNLOCK_LOCAL_VAULT,
    shouldDestroyLocalDeviceState: false,
    reason: null,
  };
}

/**
 * Plans a non-destructive local vault lock.
 *
 * The caller owns the storage side effects because browser and desktop session
 * stores differ, but the lifecycle result must be identical for timeout and
 * manual locks: private material leaves memory and the UI returns to PIN entry.
 *
 * @returns {{
 *   action: string,
 *   shouldClearIdentity: boolean,
 *   shouldClearSessionKeys: boolean,
 *   shouldClearTranscriptCache: boolean,
 *   nextVaultState: string,
 * }}
 */
export function planLocalVaultLock() {
  return {
    action: AUTH_LIFECYCLE_ACTIONS.LOCK_LOCAL_VAULT,
    shouldClearIdentity: true,
    shouldClearSessionKeys: true,
    shouldClearTranscriptCache: true,
    nextVaultState: VAULT_STATES.LOCKED,
  };
}

/**
 * Plans the outcome of a failed PIN decrypt attempt.
 *
 * @param {{ chargedCount: number, maxFailures: number }} input
 * @returns {{
 *   action: string,
 *   shouldWipeLocalVault: boolean,
 *   shouldClearSession: boolean,
 *   nextVaultState: string|null,
 *   nextHasLocalVault: boolean|null,
 *   remainingAttempts: number,
 *   errorCode: string,
 * }}
 */
export function planPinFailure({ chargedCount, maxFailures }) {
  if (!Number.isInteger(chargedCount) || chargedCount < 0) {
    throw new TypeError('chargedCount must be a non-negative integer');
  }
  if (!Number.isInteger(maxFailures) || maxFailures <= 0) {
    throw new TypeError('maxFailures must be a positive integer');
  }

  const remainingAttempts = Math.max(maxFailures - chargedCount, 0);
  if (remainingAttempts === 0) {
    return {
      action: AUTH_LIFECYCLE_ACTIONS.WIPE_LOCAL_VAULT_AFTER_PIN_FAILURES,
      shouldWipeLocalVault: true,
      shouldClearSession: true,
      nextVaultState: VAULT_STATES.NONE,
      nextHasLocalVault: false,
      remainingAttempts,
      errorCode: 'VAULT_WIPED',
    };
  }

  return {
    action: AUTH_LIFECYCLE_ACTIONS.REJECT_WRONG_PIN,
    shouldWipeLocalVault: false,
    shouldClearSession: false,
    nextVaultState: null,
    nextHasLocalVault: null,
    remainingAttempts,
    errorCode: 'WRONG_PIN',
  };
}

/**
 * Plans the in-memory state reset after local auth is no longer trusted.
 *
 * @param {string} reason
 * @returns {{
 *   action: string,
 *   reason: string,
 *   shouldClearIdentity: boolean,
 *   nextToken: null,
 *   nextUser: null,
 *   nextVaultState: string,
 *   nextHasLocalVault: boolean,
 *   nextNeedsPinSetup: boolean,
 *   nextIsGuest: boolean,
 *   nextGuestExpiresAt: null,
 *   nextError: null,
 * }}
 */
export function planLocalAuthReset(reason = 'logout') {
  return {
    action: AUTH_LIFECYCLE_ACTIONS.RESET_LOCAL_AUTH_STATE,
    reason,
    shouldClearIdentity: true,
    nextToken: null,
    nextUser: null,
    nextVaultState: VAULT_STATES.NONE,
    nextHasLocalVault: false,
    nextNeedsPinSetup: false,
    nextIsGuest: false,
    nextGuestExpiresAt: null,
    nextError: null,
  };
}
