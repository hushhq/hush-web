interface FavoriteEntry {
  id: string
  messageId: string
  body: string
  author: string
  authorInitials: string
  channelId: string
  channelName: string
  channelKind: "text" | "voice"
  serverId: string
  serverName: string
  savedAt: number
}

interface FavoritesResult {
  favorites: FavoriteEntry[]
  favoriteIds: Set<string>
  /** Always false in hush-web today: no backend support. */
  isSupported: boolean
  add: (entry: Omit<FavoriteEntry, "id" | "savedAt">) => void
  remove: (messageId: string) => void
}

/**
 * Favorites adapter — DISABLED feature.
 *
 * hush-web has no favorites backend. UI should render the controls
 * (star/save icon in message dropdown, Favorites entry in Home sidebar)
 * but every action is a no-op until the feature ships server-side.
 *
 * TODO(yarin, 2026-05-04): when favorites/star API exists, persist via
 * `transcriptVault` (encrypted local store) and sync via the same
 * channel as messages.
 */
export function useFavorites(): FavoritesResult {
  return {
    favorites: [],
    favoriteIds: new Set(),
    isSupported: false,
    add: () => {
      // no-op until backend support lands
    },
    remove: () => {
      // no-op until backend support lands
    },
  }
}

export type { FavoriteEntry }
