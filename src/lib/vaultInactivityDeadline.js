const VAULT_IDLE_DEADLINE_KEY = 'hush_vault_idle_deadline';

export function getVaultIdleDeadlineStorageKey(userId) {
  return userId ? `${VAULT_IDLE_DEADLINE_KEY}_${userId}` : VAULT_IDLE_DEADLINE_KEY;
}

export function clearPersistedInactivityDeadline(userId) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(VAULT_IDLE_DEADLINE_KEY);
  }
  if (typeof localStorage !== 'undefined' && userId) {
    localStorage.removeItem(getVaultIdleDeadlineStorageKey(userId));
  }
}

export function persistInactivityDeadline(userId, deadlineMs) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(VAULT_IDLE_DEADLINE_KEY, String(deadlineMs));
  }
  if (typeof localStorage !== 'undefined' && userId) {
    localStorage.setItem(getVaultIdleDeadlineStorageKey(userId), String(deadlineMs));
  }
}

export function readPersistedInactivityDeadline(userId) {
  const sessionRaw =
    typeof sessionStorage !== 'undefined'
      ? sessionStorage.getItem(VAULT_IDLE_DEADLINE_KEY)
      : null;
  const localRaw =
    typeof localStorage !== 'undefined' && userId
      ? localStorage.getItem(getVaultIdleDeadlineStorageKey(userId))
      : null;
  const raw = sessionRaw ?? localRaw;
  if (!raw) return null;

  const deadlineMs = Number(raw);
  if (!Number.isFinite(deadlineMs)) {
    clearPersistedInactivityDeadline(userId);
    return null;
  }
  return deadlineMs;
}

export function shouldBlockNumericVaultSessionResume(userId, policy, nowMs = Date.now()) {
  if (typeof policy !== 'number' || policy <= 0) return false;
  const deadlineMs = readPersistedInactivityDeadline(userId);
  return deadlineMs == null || nowMs >= deadlineMs;
}
