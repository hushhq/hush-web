import {
  DropdownMenuRoot, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from './ui';

// "Mute notifications" was a dead-end control: handleMute in
// ServerList wrote `hush_muted_<guildId>` to localStorage, but no
// reader ever consulted that key, so it had zero effect on
// notifications anywhere in the app. Removed pending real
// notification routing. The onMute prop is preserved on the
// component signature for callers that still pass it but is
// not surfaced as a UI control until the underlying behaviour
// exists. See ans15.md.

/**
 * Context menu for guild icon right-click or long-press actions.
 *
 * Closes on outside pointer, Escape, or when any action is invoked.
 * Dismiss behavior is owned by the DropdownMenu primitive.
 *
 * @param {{
 *   guild: object,
 *   instanceUrl: string,
 *   position: { x: number, y: number },
 *   connectionState: string,
 *   userPermissionLevel: number,
 *   onClose: () => void,
 *   onLeave: (guild: object) => void,
 *   onMute: (guild: object, duration: number|null) => void,
 *   onCopyInvite: (guild: object) => void,
 *   onMarkRead: (guild: object) => void,
 *   onSettings: (guild: object) => void,
 *   onInstanceInfo: (guild: object, instanceUrl: string) => void,
 * }} props
 */
export default function GuildContextMenu({
  guild,
  instanceUrl,
  position,
  connectionState,
  userPermissionLevel = 0,
  onClose,
  onLeave,
  onMute,
  onCopyInvite,
  onMarkRead,
  onSettings,
  onInstanceInfo,
}) {
  const instanceDomain = (() => {
    try { return new URL(instanceUrl).hostname; } catch { return instanceUrl; }
  })();

  const isOffline = connectionState !== 'connected';

  return (
    <DropdownMenuRoot open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DropdownMenuTrigger asChild>
        <span
          aria-hidden
          style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            width: 0,
            height: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={0} aria-label="Server actions">
        <div className="gcm-context-instance-label">
          {instanceDomain}
          {isOffline && <span className="gcm-context-offline-tag">offline</span>}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onMarkRead?.(guild)}>
          Mark as read
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onCopyInvite?.(guild)}
          disabled={isOffline}
        >
          Copy invite link
        </DropdownMenuItem>
        {/* "Mute notifications" intentionally removed — see top-of-file note. */}
        {userPermissionLevel >= 2 && (
          <DropdownMenuItem onSelect={() => onSettings?.(guild)}>
            Server settings
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => onInstanceInfo?.(guild, instanceUrl)}>
          Instance info
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem danger onSelect={() => onLeave?.(guild)}>
          Leave server
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
