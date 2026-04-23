import {
  DropdownMenuRoot, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem,
} from './ui';

const MENU_WIDTH = 160;

const ROLE_ORDER = { owner: 3, admin: 2, mod: 1, member: 0 };

/** Returns the numeric rank for a role string. */
function rank(role) {
  return ROLE_ORDER[role] ?? 0;
}

/**
 * Resolves which mod actions should appear in the context menu.
 *
 * Rules:
 * - Actor must have rank > target's rank (cannot act on equals or superiors)
 * - Actor cannot act on themselves
 * - Mods see: Kick, Mute
 * - Admins additionally see: Ban, Change Role
 * - Owners additionally see: Ban, Change Role (same as admin for MVP)
 */
function getAvailableActions(myRole, targetRole, isTargetSelf) {
  if (isTargetSelf) return [];
  if (rank(myRole) <= rank(targetRole)) return [];

  const actions = [
    { id: 'kick',       label: 'Kick',        minRank: 1 },
    { id: 'mute',       label: 'Mute',        minRank: 1 },
    { id: 'ban',        label: 'Ban',         minRank: 2 },
    { id: 'changeRole', label: 'Change Role', minRank: 2 },
  ];

  return actions.filter((a) => rank(myRole) >= a.minRank);
}

const DANGER_ACTIONS = new Set(['kick', 'ban']);

/**
 * Role-gated context menu for mod actions on a member.
 * Only rendered when the calling component determines the actor is mod+.
 * Dismiss behavior (Escape, outside pointer) is owned by the DropdownMenu primitive.
 *
 * @param {{ x: number, y: number, member: object, myRole: string, onAction: Function, onClose: Function }} props
 */
export default function MemberContextMenu({ x, y, member, myRole, onAction, onClose }) {
  const targetRole = member.role ?? 'member';
  const actions = getAvailableActions(myRole, targetRole, false);

  if (actions.length === 0) return null;

  return (
    <DropdownMenuRoot open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DropdownMenuTrigger asChild>
        <span
          aria-hidden
          style={{
            position: 'fixed',
            left: x,
            top: y,
            width: 0,
            height: 0,
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={0}
        aria-label="Member actions"
        style={{ minWidth: MENU_WIDTH }}
      >
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.id}
            danger={DANGER_ACTIONS.has(a.id)}
            onSelect={() => onAction(a.id)}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
