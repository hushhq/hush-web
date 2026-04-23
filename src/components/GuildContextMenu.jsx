import {
  DropdownMenuRoot, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from './ui';

/** Duration options for notification muting. */
const MUTE_DURATIONS = [
  { label: '1 hour',   ms: 60 * 60 * 1000 },
  { label: '8 hours',  ms: 8 * 60 * 60 * 1000 },
  { label: '24 hours', ms: 24 * 60 * 60 * 1000 },
  { label: 'Forever',  ms: null },
];

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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Mute notifications</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {MUTE_DURATIONS.map(({ label, ms }) => (
              <DropdownMenuItem key={label} onSelect={() => onMute?.(guild, ms)}>
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
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
