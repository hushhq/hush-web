import { formatUserLabel } from "@/lib/userLabel"

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
  return formatUserLabel({
    displayName: match.displayName,
    username: match.username,
    fallback: "",
  }) || null
}
