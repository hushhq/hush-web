import { Card } from "@/components/ui/card"
import { UserMenu, type UserMenuUser } from "@/components/user-menu"
import { VoicePip } from "@/components/voice-pip"

interface BottomDockProps {
  user: UserMenuUser
  onOpenUserSettings?: () => void
  onSignOut?: () => void | Promise<void>
  voice?: {
    channelName: string
    serverName: string
    isMuted: boolean
    isDeafened: boolean
    isVideoOn: boolean
    isScreenSharing: boolean
    onToggleMute: () => void
    onToggleDeafen: () => void
    onToggleVideo: () => void
    onToggleScreen: () => void
    onDisconnect: () => void
    onJump: () => void
  }
}

export function BottomDock({
  user,
  onOpenUserSettings,
  onSignOut,
  voice,
}: BottomDockProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {voice ? <VoicePip {...voice} /> : null}
      <Card className="gap-0 rounded-lg border py-0 ring-0 dark:shadow-sm">
        <UserMenu
          user={user}
          onOpenSettings={onOpenUserSettings}
          onSignOut={onSignOut}
        />
      </Card>
    </div>
  )
}
