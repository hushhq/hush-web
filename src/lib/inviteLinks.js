import {
  encodeGuildMetadataKeyForInvite,
  encodeGuildNameForInvite,
} from './guildMetadata';

export const CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE =
  'Cross-instance invites are not supported in this MVP. Open the invite from an account on the same instance.';

/**
 * Parses a pasted invite link into instance host and invite code.
 * Supports formats:
 *   - Full cross-instance: https://any.origin/join/{instanceHost}/{code}
 *   - Full same-instance:  https://instance.host/invite/{code}
 *   - Bare invite code:    AbC12345 (6-12 alphanumeric chars)
 *
 * @param {string} input - User-pasted invite link or code
 * @returns {{ instanceHost: string|null, code: string } | null}
 */
export function parseInviteLink(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);

    if (segments[0] === 'join' && segments.length >= 3) {
      return { instanceHost: segments[1], code: segments[2] };
    }

    if (segments[0] === 'invite' && segments.length >= 2) {
      return { instanceHost: url.host, code: segments[1] };
    }

    return null;
  } catch {
    if (/^[A-Za-z0-9]{6,12}$/.test(trimmed)) {
      return { instanceHost: null, code: trimmed };
    }
    return null;
  }
}

/**
 * Returns the host portion of an instance URL, or null when it cannot be parsed.
 *
 * @param {string|null|undefined} instanceUrl
 * @returns {string|null}
 */
export function getInviteInstanceHost(instanceUrl) {
  if (!instanceUrl) return null;
  try {
    return new URL(instanceUrl).host;
  } catch {
    return null;
  }
}

/**
 * Returns true when an invite would need the disabled cross-instance /join flow.
 *
 * @param {string} appOrigin
 * @param {string|null|undefined} instanceUrl
 * @returns {boolean}
 */
export function isCrossInstanceInviteLink(appOrigin, instanceUrl) {
  const instanceHost = getInviteInstanceHost(instanceUrl);
  if (!instanceHost) return false;
  const appHost = getInviteInstanceHost(appOrigin);
  return Boolean(appHost && instanceHost !== appHost);
}

/**
 * Builds a user-facing invite URL for the web app.
 *
 * MVP links are same-instance only. Existing /join links are still parsed so
 * the Invite page can show an explicit unsupported message, but new links must
 * not generate cross-instance invite URLs while federation is frozen.
 *
 * @param {string} appOrigin
 * @param {string|null|undefined} instanceUrl
 * @param {string} code
 * @param {string|null|undefined} guildName
 * @returns {string}
 */
export function buildGuildInviteLink(appOrigin, instanceUrl, code, guildName, guildMetadataKeyBytes = null) {
  const url = new URL(appOrigin);
  if (isCrossInstanceInviteLink(appOrigin, instanceUrl)) {
    throw new Error(CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE);
  }
  url.pathname = `/invite/${encodeURIComponent(code)}`;

  url.search = '';
  const fragment = new URLSearchParams();
  if (guildName) {
    fragment.set('name', encodeGuildNameForInvite(guildName));
  }
  if (guildMetadataKeyBytes instanceof Uint8Array) {
    fragment.set('mk', encodeGuildMetadataKeyForInvite(guildMetadataKeyBytes));
  }
  url.hash = fragment.toString();
  return url.toString();
}
