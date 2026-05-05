import * as React from "react"
import {
  HashIcon,
  PlusIcon,
  CompassIcon,
  HomeIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import type { MemberRole } from "@/components/members-sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx"

type Server = {
  id: string
  name: string
  initials: string
}

type RailSelection = "home" | string

interface ServerRailProps {
  servers: Server[]
  activeRailId: RailSelection
  onSelect: (id: RailSelection) => void
  /** Returns the current user's role on the given server. */
  getServerRole?: (serverId: string) => MemberRole | undefined
  onLeaveServer?: (serverId: string) => Promise<void> | void
  onDeleteServer?: (serverId: string) => Promise<void> | void
  onOpenServerSettings?: (serverId: string) => void
  onCreateServer?: () => void
  onDiscoverServers?: () => void
}

export function ServerRail({
  servers,
  activeRailId,
  onSelect,
  getServerRole,
  onLeaveServer,
  onDeleteServer,
  onOpenServerSettings,
  onCreateServer,
  onDiscoverServers,
}: ServerRailProps) {
  const scrollRootRef = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ top: false, bottom: true })

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!event.ctrlKey || !event.altKey) return
      const order: string[] = ["home", ...servers.map((s) => s.id)]
      const idx = order.indexOf(activeRailId)
      if (event.key === "ArrowDown") {
        event.preventDefault()
        onSelect(order[(idx + 1) % order.length])
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        onSelect(order[(idx - 1 + order.length) % order.length])
      } else if (event.key === "Home") {
        event.preventDefault()
        onSelect("home")
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [servers, activeRailId, onSelect])

  React.useEffect(() => {
    const viewport = scrollRootRef.current
    if (!viewport) return

    const update = () => {
      const canScrollUp = viewport.scrollTop > 4
      const canScrollDown =
        viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight - 4
      setEdges((prev) =>
        prev.top === canScrollUp && prev.bottom === canScrollDown
          ? prev
          : { top: canScrollUp, bottom: canScrollDown }
      )
    }
    update()
    viewport.addEventListener("scroll", update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(viewport)
    const inner = viewport.firstElementChild
    if (inner) ro.observe(inner)
    return () => {
      viewport.removeEventListener("scroll", update)
      ro.disconnect()
    }
  }, [servers.length])

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-(--rail-width) flex-col items-center bg-sidebar py-3 pl-2 md:flex">
      <div className="flex flex-col items-center gap-2 pb-2">
        <RailIcon
          label="Home"
          icon={<HomeIcon className="size-5" />}
          active={activeRailId === "home"}
          onClick={() => onSelect("home")}
        />
        <RailDivider />
      </div>
      <div className="relative min-h-0 w-full flex-1">
        <div
          ref={scrollRootRef}
          className="h-full w-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent"
        >
          <div className="flex flex-col items-center gap-2 px-2 py-1">
            {servers.map((server) => (
              <RailServer
                key={server.id}
                server={server}
                active={server.id === activeRailId}
                onClick={() => onSelect(server.id)}
                role={getServerRole?.(server.id)}
                onLeave={onLeaveServer}
                onDelete={onDeleteServer}
                onOpenSettings={onOpenServerSettings}
              />
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-3 transition-opacity",
            edges.top ? "opacity-100 duration-300" : "opacity-0 duration-50"
          )}
          style={{
            backgroundImage:
              "linear-gradient(to bottom, var(--sidebar), transparent)",
          }}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-3 transition-opacity",
            edges.bottom ? "opacity-100 duration-300" : "opacity-0 duration-50"
          )}
          style={{
            backgroundImage:
              "linear-gradient(to top, var(--sidebar), transparent)",
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-2 pt-2">
        <RailDivider />
        <RailIcon
          label="Add server"
          icon={<PlusIcon className="size-5" />}
          muted
          onClick={onCreateServer}
        />
        <RailIcon
          label="Discover"
          icon={<CompassIcon className="size-5" />}
          muted
          onClick={onDiscoverServers}
        />
      </div>
    </aside>
  )
}

function RailServer({
  server,
  active,
  onClick,
  role,
  onLeave,
  onDelete,
  onOpenSettings,
}: {
  server: Server
  active: boolean
  onClick: () => void
  role?: MemberRole
  onLeave?: (serverId: string) => Promise<void> | void
  onDelete?: (serverId: string) => Promise<void> | void
  onOpenSettings?: (serverId: string) => void
}) {
  const [leaveOpen, setLeaveOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const isOwner = role === "owner"
  const isMember = role === "member" || role === "moderator"
  // Without a known role we can't safely show destructive items; settings
  // remains available because the dialog itself enforces backend permissions.
  const canDelete = isOwner && Boolean(onDelete)
  const canLeave = isMember && Boolean(onLeave)
  const canOpenSettings =
    role === "owner" || role === "admin" || (active && !role)

  return (
    <ContextMenu>
      <Tooltip>
        <ContextMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onClick}
              className={cn(
                "group relative size-11 rounded-2xl bg-sidebar-accent p-0 text-sm font-semibold text-sidebar-accent-foreground hover:rounded-xl hover:bg-primary hover:text-primary-foreground",
                active && "rounded-xl bg-primary text-primary-foreground"
              )}
              aria-label={server.name}
              aria-current={active ? "true" : undefined}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-[10px] h-0 w-1 rounded-r-full bg-foreground transition-all",
                  active ? "h-8" : "group-hover:h-5"
                )}
              />
              {server.initials}
            </Button>
          </TooltipTrigger>
        </ContextMenuTrigger>
        <TooltipContent side="right">{server.name}</TooltipContent>
      </Tooltip>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="text-xs text-muted-foreground">
          {server.name}
        </ContextMenuLabel>
        <ContextMenuItem
          disabled={!canOpenSettings || !onOpenSettings}
          onSelect={(event) => {
            event.preventDefault()
            onOpenSettings?.(server.id)
          }}
        >
          <SettingsIcon className="size-4" />
          Server settings
        </ContextMenuItem>
        <ContextMenuSeparator />
        {canDelete ? (
          <ContextMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault()
              setDeleteOpen(true)
            }}
          >
            <LogOutIcon className="size-4" />
            Delete server
          </ContextMenuItem>
        ) : (
          <ContextMenuItem
            variant="destructive"
            disabled={!canLeave}
            onSelect={(event) => {
              event.preventDefault()
              setLeaveOpen(true)
            }}
          >
            <LogOutIcon className="size-4" />
            Leave server
          </ContextMenuItem>
        )}
      </ContextMenuContent>
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave {server.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to all channels and conversations in
              {" "}
              {server.name}. Re-joining requires a new invite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                void onLeave?.(server.id)
              }}
            >
              Leave server
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {server.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the server, its channels, and all
              messages for every member. Cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                void onDelete?.(server.id)
              }}
            >
              Delete forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContextMenu>
  )
}

function RailIcon({
  label,
  icon,
  active,
  muted,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  muted?: boolean
  onClick?: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={onClick}
          className={cn(
            "size-11 rounded-2xl bg-sidebar-accent p-0 text-sidebar-accent-foreground hover:rounded-xl hover:bg-primary hover:text-primary-foreground [&_svg:not([class*='size-'])]:size-5",
            active && "rounded-xl bg-primary text-primary-foreground",
            muted &&
              "bg-transparent text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
          )}
          aria-label={label}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function RailDivider() {
  return <div className="h-px w-8 rounded bg-border" aria-hidden />
}

export type { Server }
export { HashIcon }
