export const AUTH_INVALIDATION_REASONS = Object.freeze({
  DEVICE_REVOKED: 'device_revoked',
  SERVER_SESSION_INVALID: 'server_session_invalid',
});

export const AUTH_LIFECYCLE_ACTIONS = Object.freeze({
  DESTROY_REVOKED_DEVICE_STATE: 'destroy_revoked_device_state',
  DISCOVER_LOCAL_VAULT: 'discover_local_vault',
  INVALIDATE_SERVER_SESSION: 'invalidate_server_session',
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
