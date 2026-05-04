import * as React from "react"
import {
  AtSignIcon,
  BanIcon,
  CopyIcon,
  CrownIcon,
  MessageSquareIcon,
  ShieldIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover.tsx"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type MemberPresence = "online" | "idle" | "dnd" | "offline"
export type MemberRole = "owner" | "admin" | "moderator" | "member" | "bot"

export interface ServerMember {
  id: string
  name: string
  initials: string
  presence?: MemberPresence
  role: MemberRole
}

interface MembersSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  serverName: string
  members: ServerMember[]
  isMobile: boolean
}

const ROLE_ORDER: MemberRole[] = ["owner", "admin", "moderator", "member"]

const ROLE_LABEL: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admins",
  moderator: "Moderators",
  bot: "Bots",
  member: "Members",
}

const ROLE_ICON: Record<MemberRole, React.ReactNode> = {
  owner: <CrownIcon className="size-3.5" />,
  admin: <ShieldIcon className="size-3.5" />,
  moderator: <ShieldIcon className="size-3.5" />,
  bot: <UserIcon className="size-3.5" />,
  member: <UserIcon className="size-3.5" />,
}

const PANEL_WIDTH = "16rem"

export function MembersSidebar({
  open,
  onOpenChange,
  serverName,
  members,
  isMobile,
}: MembersSidebarProps) {
  const grouped = ROLE_ORDER.map((role) => ({
    role,
    items: members.filter((m) => m.role === role),
  })).filter((group) => group.items.length > 0)

  const body = <MembersList grouped={grouped} />

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-72 flex-col gap-0 bg-card p-0">
          <SheetHeader className="flex h-14 shrink-0 flex-row items-center justify-between border-b px-4 py-0 space-y-0">
            <SheetTitle className="text-sm font-semibold">Members</SheetTitle>
            <SheetDescription className="text-xs">
              {serverName} · {members.length}
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      data-state={open ? "open" : "closed"}
      style={{ width: open ? PANEL_WIDTH : "0px" }}
      className={cn(
        "h-full shrink-0 overflow-clip border-l transition-[width] duration-200 ease-in-out"
      )}
    >
      <div
        style={{ width: PANEL_WIDTH }}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <span className="text-sm font-semibold">Members</span>
          <span className="text-xs text-muted-foreground">{members.length}</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{body}</div>
      </div>
    </aside>
  )
}

const ROLE_BADGE_LABEL: Record<MemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  moderator: "Moderator",
  bot: "Bot",
  member: "Member",
}

function MemberRow({ member }: { member: ServerMember }) {
  const [profileOpen, setProfileOpen] = React.useState(false)

  return (
    <Popover open={profileOpen} onOpenChange={setProfileOpen}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <PopoverAnchor asChild>
            <button
              type="button"
              onClick={() => setProfileOpen((p) => !p)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60 data-[state=open]:bg-muted/60"
              data-state={profileOpen ? "open" : "closed"}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] text-muted-foreground">
                {member.initials}
              </span>
              <span className="truncate text-sm">{member.name}</span>
            </button>
          </PopoverAnchor>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onSelect={() => setProfileOpen(true)}>
            <UserIcon />
            View profile
          </ContextMenuItem>
          <ContextMenuItem>
            <MessageSquareIcon />
            Send message
          </ContextMenuItem>
          <ContextMenuItem>
            <AtSignIcon />
            Mention in channel
          </ContextMenuItem>
          <ContextMenuItem>
            <UserPlusIcon />
            Add friend
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <CopyIcon />
            Copy user ID
          </ContextMenuItem>
          {member.role !== "owner" ? (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">
                <BanIcon />
                Kick from server
              </ContextMenuItem>
            </>
          ) : null}
        </ContextMenuContent>
      </ContextMenu>
      <PopoverContent
        side="left"
        align="start"
        sideOffset={12}
        className="w-72 p-0"
      >
        <ProfileCard member={member} />
      </PopoverContent>
    </Popover>
  )
}

function ProfileCard({ member }: { member: ServerMember }) {
  return (
    <div className="flex flex-col">
      <div className="h-14 rounded-t-md bg-gradient-to-br from-primary/30 to-primary/5" />
      <div className="-mt-7 flex flex-col gap-3 px-4 pb-4">
        <span className="flex size-14 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
          {member.initials}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold">{member.name}</span>
          <span className="text-xs text-muted-foreground">
            {ROLE_BADGE_LABEL[member.role]}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 rounded-md bg-muted/40 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Member since</span>
            <span>Apr 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="capitalize">{member.presence ?? "online"}</span>
          </div>
        </div>
        <button
          type="button"
          className="flex h-8 items-center justify-center gap-2 rounded-md bg-muted text-xs font-medium transition-colors hover:bg-muted/70"
        >
          <MessageSquareIcon className="size-3.5" />
          Send message
        </button>
      </div>
    </div>
  )
}

interface GroupedMembers {
  role: MemberRole
  items: ServerMember[]
}

function MembersList({ grouped }: { grouped: GroupedMembers[] }) {
  return (
    <div className="flex flex-col gap-4 p-3">
      {grouped.map((group) => (
        <section key={group.role} className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {ROLE_ICON[group.role]}
            <span>
              {ROLE_LABEL[group.role]} — {group.items.length}
            </span>
          </div>
          <ul className="flex flex-col">
            {group.items.map((member) => (
              <li key={member.id}>
                <MemberRow member={member} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
