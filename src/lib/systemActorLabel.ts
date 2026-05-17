interface ActorCandidate {
  id: string
  displayName?: string | null
  username?: string | null
}

export function resolveActorLabel(
  members: ReadonlyArray<ActorCandidate>,
  id: string
): string | null {
  const match = members.find((m) => m.id === id)
  if (!match) return null
  const displayName = match.displayName?.trim()
  if (displayName) return displayName
  const username = match.username?.trim().replace(/^@+/, "")
  if (username) return `@${username}`
  return null
}
