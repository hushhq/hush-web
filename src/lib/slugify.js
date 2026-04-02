/**
 * Slug generation utilities for guild and channel names.
 *
 * Produces URL-safe, deterministic, Unicode-aware slugs from decrypted names.
 * Characters retained: Unicode letters, Unicode decimal digits, and hyphens.
 *
 * @module slugify
 */

/** Maximum slug length in characters. */
const MAX_SLUG_LENGTH = 64;

/** Fallback slug returned for empty or pure-symbol names. */
const FALLBACK_SLUG = 'unnamed';
const GUILD_ROUTE_SEPARATOR = '--';

// ---------------------------------------------------------------------------
// slugify
// ---------------------------------------------------------------------------

/**
 * Convert a name string to a URL-safe slug.
 *
 * Rules applied in order:
 * 1. Trim leading/trailing whitespace.
 * 2. Lowercase.
 * 3. Replace all whitespace runs with a single hyphen.
 * 4. Strip characters that are not Unicode letters (\\p{L}), Unicode digits (\\p{N}), or hyphens.
 * 5. Collapse consecutive hyphens into one.
 * 6. Strip leading/trailing hyphens.
 * 7. Truncate to MAX_SLUG_LENGTH characters, then strip any trailing hyphen introduced by truncation.
 * 8. If the result is empty, return FALLBACK_SLUG ('unnamed').
 *
 * @param {string} name - Raw name string (may contain Unicode, spaces, symbols).
 * @returns {string} URL-safe slug.
 */
export function slugify(name) {
  if (typeof name !== 'string') return FALLBACK_SLUG;

  let slug = name.trim().toLowerCase();

  // Replace whitespace runs with hyphen.
  slug = slug.replace(/\s+/g, '-');

  // Strip characters that are not Unicode letters, digits, or hyphens.
  // \p{L} = Unicode letter, \p{N} = Unicode decimal digit.
  slug = slug.replace(/[^\p{L}\p{N}-]/gu, '');

  // Collapse consecutive hyphens.
  slug = slug.replace(/-{2,}/g, '-');

  // Strip leading and trailing hyphens.
  slug = slug.replace(/^-+|-+$/g, '');

  // Truncate.
  if (slug.length > MAX_SLUG_LENGTH) {
    slug = slug.slice(0, MAX_SLUG_LENGTH).replace(/-+$/, '');
  }

  return slug || FALLBACK_SLUG;
}

// ---------------------------------------------------------------------------
// resolveGuildSlug
// ---------------------------------------------------------------------------

/**
 * Return a unique slug for a guild by appending a numeric suffix on collision.
 *
 * The first available slug is returned:
 *   - base slug (no suffix) - if not in existingSlugs
 *   - base-2, base-3, ... - until a free slot is found
 *
 * @param {string} name - Raw guild name to slugify.
 * @param {string[]} existingSlugs - Array of slug strings already in use.
 * @returns {string} Unique slug.
 */
export function resolveGuildSlug(name, existingSlugs) {
  const base = slugify(name);
  const taken = new Set(existingSlugs);

  if (!taken.has(base)) return base;

  for (let counter = 2; ; counter++) {
    const candidate = `${base}-${counter}`;
    if (!taken.has(candidate)) return candidate;
  }
}

// ---------------------------------------------------------------------------
// Guild route refs
// ---------------------------------------------------------------------------

/**
 * Build a stable guild route reference.
 *
 * The readable slug remains first for human-friendly URLs, but the guild ID is
 * appended as a stable suffix so route resolution does not depend on decrypted
 * metadata being available during boot.
 *
 * @param {string} name - Best available display name for the guild.
 * @param {string} guildId - Stable guild UUID.
 * @returns {string} Route-safe guild reference.
 */
export function buildGuildRouteRef(name, guildId) {
  const slug = slugify(name ?? guildId);
  if (!guildId) {
    return slug;
  }
  return `${slug}${GUILD_ROUTE_SEPARATOR}${guildId}`;
}

/**
 * Parse a guild route reference produced by buildGuildRouteRef().
 *
 * Legacy slug-only routes remain supported and return a null guildId.
 *
 * @param {string} routeRef
 * @returns {{ guildId: string|null, slug: string }}
 */
export function parseGuildRouteRef(routeRef) {
  if (typeof routeRef !== 'string' || routeRef.length === 0) {
    return { guildId: null, slug: FALLBACK_SLUG };
  }

  const separatorIndex = routeRef.lastIndexOf(GUILD_ROUTE_SEPARATOR);
  if (separatorIndex <= 0) {
    return { guildId: null, slug: routeRef };
  }

  return {
    guildId: routeRef.slice(separatorIndex + GUILD_ROUTE_SEPARATOR.length) || null,
    slug: routeRef.slice(0, separatorIndex) || FALLBACK_SLUG,
  };
}
