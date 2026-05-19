export const AUTH_INVALIDATION_REASONS = Object.freeze({
  DEVICE_REVOKED: 'device_revoked',
  SERVER_SESSION_INVALID: 'server_session_invalid',
});

export const AUTH_LIFECYCLE_ACTIONS = Object.freeze({
  BLOCK_REVOKED_DEVICE_UNLOCK: 'block_revoked_device_unlock',
  DESTROY_REVOKED_DEVICE_STATE: 'destroy_revoked_device_state',
  DISCOVER_LOCAL_VAULT: 'discover_local_vault',
  INVALIDATE_SERVER_SESSION: 'invalidate_server_session',
  UNLOCK_LOCAL_VAULT: 'unlock_local_vault',
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
