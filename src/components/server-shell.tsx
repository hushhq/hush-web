/**
 * ServerShell — UI port shell composing the new shadcn-based ChannelView
 * with hush-web's existing data layer (AuthContext + InstanceContext +
 * Chat.jsx as message engine).
 *
 * Mounted at /v2/:instance/:guildSlug/:channelSlug? as a parallel route
 * to the legacy ServerLayout while migration is in progress. Final swap
 * in Phase 7 cleanup.
 */
import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"

import { ChannelView } from "@/components/channel-view"
import {
  useChannelsForServer,
  useMembersForServer,
} from "@/adapters"
import { useAuth } from "@/contexts/AuthContext.jsx"
import { useInstanceContext } from "@/contexts/InstanceContext.jsx"

interface RawGuild {
  id: string
  name?: string
  _localName?: string
  instanceUrl: string | null
}

export default function ServerShell() {
  const params = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mergedGuilds, getTokenForInstance } = useInstanceContext()

  const { instance: instanceParam, guildSlug, channelSlug } = params

  const activeGuild = React.useMemo<RawGuild | null>(() => {
    if (!instanceParam || !guildSlug) return null
    return (
      mergedGuilds.find((g: RawGuild) => {
        if (!g.instanceUrl) return false
        try {
          return new URL(g.instanceUrl).host === instanceParam && g.id === guildSlug
        } catch {
          return false
        }
      }) ?? null
    )
  }, [mergedGuilds, instanceParam, guildSlug])

  const serverId = activeGuild?.id ?? null
  const instanceUrl = activeGuild?.instanceUrl ?? null
  const token = instanceUrl ? getTokenForInstance(instanceUrl) : null
  const baseUrl = instanceUrl ?? ""

  const { channels } = useChannelsForServer({
    serverId,
    token,
    baseUrl,
  })

  const { members } = useMembersForServer({
    serverId,
    token,
    baseUrl,
    currentUserId: user?.id ?? null,
  })

  const activeChannel = React.useMemo(() => {
    if (!channelSlug) return null
    return channels.find((c) => c.id === channelSlug) ?? null
  }, [channels, channelSlug])

  const handleSelectChannel = React.useCallback(
    (id: string) => {
      if (!instanceParam || !guildSlug) return
      navigate(`/v2/${instanceParam}/${guildSlug}/${id}`)
    },
    [instanceParam, guildSlug, navigate]
  )

  if (!activeGuild) {
    return (
      <div className="flex h-svh items-center justify-center text-sm text-muted-foreground">
        Server not found
      </div>
    )
  }

  if (!activeChannel) {
    const first = channels[0]
    if (first) {
      handleSelectChannel(first.id)
    }
    return (
      <div className="flex h-svh items-center justify-center text-sm text-muted-foreground">
        Loading channels…
      </div>
    )
  }

  return (
    <ChannelView
      channelId={activeChannel.id}
      channelName={activeChannel.name}
      channelKind={activeChannel.kind}
      channelTopic={`${activeChannel.kind === "voice" ? "Voice channel" : "Text channel"}`}
      channelContext={{
        serverId: activeGuild.id,
        serverName: activeGuild._localName ?? activeGuild.name ?? activeGuild.id,
      }}
      members={members}
    />
  )
}

