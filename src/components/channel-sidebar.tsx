import * as React from "react"
import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  GripVerticalIcon,
  HashIcon,
  HeadphoneOffIcon,
  MicOffIcon,
  Volume2Icon,
  PlusIcon,
  FolderPlusIcon,
  CompassIcon,
  ScrollTextIcon,
  ShieldAlertIcon,
  LogOutIcon,
  PuzzleIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button.tsx"
import { BottomDock } from "@/components/bottom-dock"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type ChannelKind = "text" | "voice"
/** Kinds that the create-from-context-menu flow can produce. Categories are
 *  not first-class `Channel` rows (they live in `ChannelCategory`), but the
 *  backend mints them through the same `createGuildChannel` endpoint with
 *  `type: "category"`. The shell maps the response back into the right list. */
type CreateChannelKind = "text" | "voice" | "category"

type VoiceParticipant = {
  id: string
  name: string
  initials: string
  isMuted?: boolean
  isDeafened?: boolean
  isSpeaking?: boolean
}

type Channel = {
  id: string
  name: string
  kind: ChannelKind
  categoryId: string | null
  unreadCount?: number
  mentionCount?: number
  participants?: VoiceParticipant[]
}

type ChannelCategory = {
  id: string
  name: string
}

const ROOT_DROPPABLE_ID = "__root__"

type SystemChannel = {
  id: string
  name: string
  icon: React.ReactNode
}

type AppEntry = {
  id: string
  name: string
  icon: React.ReactNode
}

interface RailEntry {
  id: string
  name: string
  initials: string
}

type DirectMessage = {
  id: string
  name: string
  initials: string
  presence?: "online" | "idle" | "dnd" | "offline"
}

interface JoinedVoiceInfo {
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

interface ChannelSidebarProps {
  serverName: string
  serverPlan?: string
  systemChannels: SystemChannel[]
  categories: ChannelCategory[]
  channels: Channel[]
  apps?: AppEntry[]
  directMessages?: DirectMessage[]
  activeChannelId: string
  onSelectChannel: (id: string) => void
  onCategoriesChange?: (next: ChannelCategory[]) => void
  onChannelsChange?: (next: Channel[]) => void
  user: { name: string; email: string; initials: string }
  railEntries: RailEntry[]
  activeRailId: string
  onSelectRail: (id: string) => void
  voice?: JoinedVoiceInfo
  onOpenServerSettings?: () => void
  onOpenUserSettings?: () => void
  /** Create a new channel of the given kind. Resolves on success. */
  onCreateChannel?: (
    kind: CreateChannelKind,
    name: string,
    parentId?: string | null
  ) => Promise<void>
  /** Delete a channel. Confirmation handled by caller via wrapper if needed. */
  onDeleteChannel?: (channelId: string) => Promise<void>
  /** Create an invite for the active server. Returns the shareable URL. */
  onCreateInvite?: () => Promise<string | null>
  /** Whether the current user can perform admin actions (create/delete channel, invite). */
  canAdministrate?: boolean
  /** Home/DM surfaces reuse this shell but must not expose server actions. */
  serverMenuEnabled?: boolean
  /** Open the create-server dialog (mobile rail dropdown surfaces this since
   *  the desktop bottom rail with [+]/Discover icons is not visible). */
  onCreateServer?: () => void
  /** Navigate to the discover-servers route. */
  onDiscoverServers?: () => void
}

const CHANNELS_SECTION_LABEL = "Channels"

export function ChannelSidebar({
  serverName,
  serverPlan,
  systemChannels,
  categories,
  channels,
  // apps prop reserved for a future integrations row; rendering is gated
  // on backend support and currently disabled.
  apps: _apps,
  directMessages,
  activeChannelId,
  onSelectChannel,
  onCategoriesChange,
  onChannelsChange,
  user,
  railEntries,
  activeRailId,
  onSelectRail,
  voice,
  onOpenServerSettings,
  onOpenUserSettings,
  onCreateChannel,
  onDeleteChannel,
  onCreateInvite,
  canAdministrate = false,
  serverMenuEnabled = true,
  onCreateServer,
  onDiscoverServers,
}: ChannelSidebarProps) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()

  const inner = (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-card dark:shadow-sm">
        <SidebarHeader>
          <ServerHeader
            name={serverName}
            plan={serverPlan}
            railEntries={railEntries}
            activeRailId={activeRailId}
            onSelectRail={onSelectRail}
            onOpenServerSettings={onOpenServerSettings}
            onCreateInvite={onCreateInvite}
            canAdministrate={canAdministrate}
            menuEnabled={serverMenuEnabled}
            onCreateServer={onCreateServer}
            onDiscoverServers={onDiscoverServers}
          />
        </SidebarHeader>
        <SidebarContent className="show-native-scrollbar">
          {systemChannels.length > 0 ? (
            <SystemSection
              channels={systemChannels}
              activeChannelId={activeChannelId}
              onSelect={onSelectChannel}
            />
          ) : null}
          {directMessages && directMessages.length > 0 ? (
            <DirectMessagesSection
              entries={directMessages}
              activeChannelId={activeChannelId}
              onSelect={onSelectChannel}
            />
          ) : null}
          {/* Always render ChannelsSection. Hiding it when both lists are
              empty was the bug behind two visible symptoms:
                1. right-click on the empty channel-list area never opened
                   the New category / New text channel / New voice channel
                   menu — the ContextMenuTrigger wasn't in the DOM.
                2. channels with a parentId pointing at a category we
                   somehow filtered out became invisible (orphan channels);
                   the command palette shows them but the sidebar didn't.
              The empty-state SidebarGroup is small and harmless. */}
          <ChannelsSection
            categories={categories}
            channels={channels}
            activeChannelId={activeChannelId}
            onSelect={onSelectChannel}
            onCategoriesChange={onCategoriesChange}
            onChannelsChange={onChannelsChange}
            onCreateChannel={onCreateChannel}
            onDeleteChannel={onDeleteChannel}
            canAdministrate={canAdministrate}
          />
          {/* maybe for future: {apps.length > 0 ? <AppsSection apps={apps} /> : null} */}
        </SidebarContent>
      </div>
      <BottomDock
        user={user}
        voice={voice}
        onOpenUserSettings={onOpenUserSettings}
      />
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          side="left"
          data-slot="sidebar"
          className="flex w-72 flex-col gap-2 bg-sidebar p-2 [&>button]:hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Channels and direct messages.</SheetDescription>
          </SheetHeader>
          {inner}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <aside
      data-slot="sidebar"
      className="hidden h-full min-h-0 w-full flex-col gap-2 p-2 md:flex"
    >
      {inner}
    </aside>
  )
}

function ServerHeader({
  name,
  plan,
  railEntries,
  activeRailId,
  onSelectRail,
  onOpenServerSettings,
  onCreateInvite,
  canAdministrate,
  menuEnabled,
  onCreateServer,
  onDiscoverServers,
}: {
  name: string
  plan?: string
  railEntries: RailEntry[]
  activeRailId: string
  onSelectRail: (id: string) => void
  onOpenServerSettings?: () => void
  onCreateInvite?: () => Promise<string | null>
  canAdministrate?: boolean
  menuEnabled?: boolean
  onCreateServer?: () => void
  onDiscoverServers?: () => void
}) {
  const [leaveOpen, setLeaveOpen] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [inviteUrl, setInviteUrl] = React.useState<string | null>(null)
  const [inviteError, setInviteError] = React.useState<string | null>(null)
  const [inviteBusy, setInviteBusy] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleInvite = React.useCallback(async () => {
    if (!onCreateInvite) return
    setInviteBusy(true)
    setInviteError(null)
    setInviteUrl(null)
    setCopied(false)
    setInviteOpen(true)
    try {
      const url = await onCreateInvite()
      setInviteUrl(url ?? null)
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to create invite")
    } finally {
      setInviteBusy(false)
    }
  }, [onCreateInvite])

  const handleCopy = React.useCallback(() => {
    if (!inviteUrl) return
    void navigator.clipboard?.writeText(inviteUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [inviteUrl])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{name}</span>
                {plan ? (
                  <span className="truncate text-xs text-muted-foreground">
                    {plan}
                  </span>
                ) : null}
              </div>
              <ChevronsUpDownIcon
                className={cn("ml-auto size-4 opacity-70", !menuEnabled && "md:hidden")}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(
              "w-(--radix-dropdown-menu-trigger-width) min-w-56",
              !menuEnabled && "md:hidden"
            )}
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <div className="md:hidden">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Servers
              </DropdownMenuLabel>
              <div className="max-h-64 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent_0,black_12px,black_calc(100%-12px),transparent_100%)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
                {railEntries.map((entry) => (
                  <DropdownMenuItem
                    key={entry.id}
                    onSelect={() => onSelectRail(entry.id)}
                    className={cn(
                      entry.id === activeRailId &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <span className="flex size-5 items-center justify-center rounded-md bg-sidebar-accent text-[10px] font-semibold text-sidebar-accent-foreground">
                      {entry.initials}
                    </span>
                    {entry.name}
                  </DropdownMenuItem>
                ))}
              </div>
              {/* Mobile-only: mirror the desktop rail bottom dock so users
                  on a phone can create or discover servers without a
                  dedicated FAB. Items render at the end of the rail
                  dropdown after the home + server entries. */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!onCreateServer}
                onSelect={() => onCreateServer?.()}
              >
                <PlusIcon className="size-4" />
                Add server
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!onDiscoverServers}
                onSelect={() => onDiscoverServers?.()}
              >
                <CompassIcon className="size-4" />
                Discover servers
              </DropdownMenuItem>
              {menuEnabled ? <DropdownMenuSeparator /> : null}
            </div>
            {menuEnabled ? (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Server
                </DropdownMenuLabel>
                <DropdownMenuItem
                  disabled={!onOpenServerSettings}
                  onSelect={() => onOpenServerSettings?.()}
                >
                  <SettingsIcon className="size-4" />
                  Server settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canAdministrate || !onCreateInvite}
                  onSelect={(event) => {
                    event.preventDefault()
                    void handleInvite()
                  }}
                >
                  <PlusIcon className="size-4" />
                  Invite people
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault()
                    setLeaveOpen(true)
                  }}
                >
                  <LogOutIcon className="size-4" />
                  Leave server
                </DropdownMenuItem>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You will lose access to all channels and conversations in {name}.
              Re-joining requires a new invite.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              Leave server
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Share this link to let new members join. Single-use unless server
              policy allows reuse.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            {inviteBusy ? (
              <div className="text-sm text-muted-foreground">
                Generating invite…
              </div>
            ) : inviteError ? (
              <div className="text-sm text-destructive">{inviteError}</div>
            ) : inviteUrl ? (
              <div className="flex items-center gap-2">
                <Input readOnly value={inviteUrl} className="font-mono text-xs" />
                <Button type="button" size="sm" onClick={handleCopy}>
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setInviteOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}

function SystemSection({
  channels,
  activeChannelId,
  onSelect,
}: {
  channels: SystemChannel[]
  activeChannelId: string
  onSelect: (id: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>System</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {channels.map((channel) => (
            <SidebarMenuItem key={channel.id}>
              <SidebarMenuButton
                isActive={channel.id === activeChannelId}
                onClick={() => onSelect(channel.id)}
              >
                {channel.icon}
                <span>{channel.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function DirectMessagesSection({
  entries,
  activeChannelId,
  onSelect,
}: {
  entries: DirectMessage[]
  activeChannelId: string
  onSelect: (id: string) => void
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Direct messages</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {entries.map((entry) => (
            <SidebarMenuItem key={entry.id}>
              <SidebarMenuButton
                isActive={entry.id === activeChannelId}
                onClick={() => onSelect(entry.id)}
              >
                <Avatar className="size-5 rounded-full">
                  <AvatarFallback className="rounded-full text-[10px]">
                    {entry.initials}
                  </AvatarFallback>
                </Avatar>
                <span>{entry.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

type DraggedKind = "category" | "channel"

interface ChannelsSectionProps {
  categories: ChannelCategory[]
  channels: Channel[]
  activeChannelId: string
  onSelect: (id: string) => void
  onCategoriesChange?: (next: ChannelCategory[]) => void
  onChannelsChange?: (next: Channel[]) => void
  onCreateChannel?: (
    kind: CreateChannelKind,
    name: string,
    parentId?: string | null
  ) => Promise<void>
  onDeleteChannel?: (channelId: string) => Promise<void>
  canAdministrate?: boolean
}

function ChannelsSection({
  categories,
  channels,
  activeChannelId,
  onSelect,
  onCategoriesChange,
  onChannelsChange,
  onCreateChannel,
  onDeleteChannel,
  canAdministrate = false,
}: ChannelsSectionProps) {
  const [createOpen, setCreateOpen] = React.useState<CreateChannelKind | null>(null)
  const [createParentId, setCreateParentId] = React.useState<string | null>(null)
  const [createName, setCreateName] = React.useState("")
  const [createBusy, setCreateBusy] = React.useState(false)
  const [createError, setCreateError] = React.useState<string | null>(null)

  const openCreate = React.useCallback(
    (kind: CreateChannelKind, parentId: string | null = null) => {
      setCreateOpen(kind)
      setCreateParentId(parentId)
      setCreateName("")
      setCreateError(null)
    },
    []
  )

  const submitCreate = React.useCallback(async () => {
    if (!createOpen || !onCreateChannel) return
    const name = createName.trim()
    if (!name) {
      setCreateError(
        createOpen === "category" ? "Category name required" : "Channel name required"
      )
      return
    }
    setCreateBusy(true)
    setCreateError(null)
    try {
      await onCreateChannel(createOpen, name, createParentId)
      setCreateOpen(null)
      setCreateParentId(null)
    } catch (err) {
      const fallback =
        createOpen === "category" ? "Failed to create category" : "Failed to create channel"
      setCreateError(err instanceof Error ? err.message : fallback)
    } finally {
      setCreateBusy(false)
    }
  }, [createOpen, createName, createParentId, onCreateChannel])
  const [activeDrag, setActiveDrag] = React.useState<{
    id: string
    kind: DraggedKind
  } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const channelsByCategory = React.useMemo(() => {
    const map = new Map<string | null, Channel[]>()
    map.set(null, [])
    const knownCategoryIds = new Set(categories.map((c) => c.id))
    for (const cat of categories) map.set(cat.id, [])
    for (const ch of channels) {
      // Orphan channels (parentId set but the category isn't visible to us
      // — e.g. backend race, permission filter, or a missing template
      // category) fold into root so they remain reachable. Otherwise they
      // would only show in the command palette and never in the sidebar.
      const key =
        ch.categoryId !== null && !knownCategoryIds.has(ch.categoryId)
          ? null
          : ch.categoryId
      map.get(key)!.push(ch)
    }
    return map
  }, [categories, channels])

  const collisionDetection: CollisionDetection = React.useCallback(
    (args) => {
      const activeKind = args.active.data.current?.kind as DraggedKind | undefined
      if (!activeKind) return closestCorners(args)
      const filtered = args.droppableContainers.filter((container) => {
        const accepts = container.data.current?.accepts as
          | DraggedKind[]
          | undefined
        if (!accepts) return false
        return accepts.includes(activeKind)
      })
      return closestCorners({ ...args, droppableContainers: filtered })
    },
    []
  )

  const handleDragStart = (event: DragStartEvent) => {
    const kind = event.active.data.current?.kind as DraggedKind | undefined
    if (!kind) return
    setActiveDrag({ id: String(event.active.id), kind })
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveDrag(null)
    if (!over) return
    const activeKind = active.data.current?.kind as DraggedKind | undefined

    if (activeKind === "category") {
      if (active.id === over.id) return
      const oldIndex = categories.findIndex((c) => c.id === active.id)
      const newIndex = categories.findIndex((c) => c.id === over.id)
      if (oldIndex < 0 || newIndex < 0) return
      onCategoriesChange?.(arrayMove(categories, oldIndex, newIndex))
      return
    }

    if (activeKind === "channel") {
      const activeChannel = channels.find((c) => c.id === active.id)
      if (!activeChannel) return

      const overData = over.data.current as
        | { kind?: DraggedKind; categoryId?: string | null }
        | undefined

      let targetCategoryId: string | null
      if (over.id === ROOT_DROPPABLE_ID) {
        targetCategoryId = null
      } else if (overData?.kind === "category") {
        targetCategoryId = String(over.id).startsWith("cat-zone-")
          ? String(over.id).slice("cat-zone-".length)
          : null
      } else if (overData?.kind === "channel") {
        targetCategoryId = (overData.categoryId ?? null) as string | null
      } else {
        return
      }

      const channelsWithoutActive = channels.filter((c) => c.id !== active.id)
      const targetSubset = channelsWithoutActive.filter(
        (c) => c.categoryId === targetCategoryId
      )
      const overChannelId =
        overData?.kind === "channel" ? String(over.id) : null
      const insertIndex = overChannelId
        ? targetSubset.findIndex((c) => c.id === overChannelId)
        : targetSubset.length

      const nextTargetSubset = [...targetSubset]
      nextTargetSubset.splice(Math.max(insertIndex, 0), 0, {
        ...activeChannel,
        categoryId: targetCategoryId,
      })

      const next = [
        ...channelsWithoutActive.filter((c) => c.categoryId !== targetCategoryId),
        ...nextTargetSubset,
      ]
      if (!sameChannelOrder(channels, next)) onChannelsChange?.(next)
    }
  }

  const rootChannels = channelsByCategory.get(null) ?? []
  const draggedChannel =
    activeDrag?.kind === "channel"
      ? channels.find((c) => c.id === activeDrag.id) ?? null
      : null
  const draggedCategory =
    activeDrag?.kind === "category"
      ? categories.find((c) => c.id === activeDrag.id) ?? null
      : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <ContextMenu>
        <ContextMenuTrigger className="flex flex-1 flex-col">
          <SidebarGroup className="flex-1">
            <SidebarGroupLabel>{CHANNELS_SECTION_LABEL}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-1">
              <RootChannelsZone
                channels={rootChannels}
                activeChannelId={activeChannelId}
                onSelect={onSelect}
                onDeleteChannel={onDeleteChannel}
                canAdministrate={canAdministrate}
              />
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((category) => (
                  <SortableCategory
                    key={category.id}
                    category={category}
                    channels={channelsByCategory.get(category.id) ?? []}
                    activeChannelId={activeChannelId}
                    onSelect={onSelect}
                    onDeleteChannel={onDeleteChannel}
                    canAdministrate={canAdministrate}
                    onCreateTextChannel={
                      canAdministrate && onCreateChannel
                        ? () => openCreate("text", category.id)
                        : undefined
                    }
                  />
                ))}
              </SortableContext>
            </SidebarGroupContent>
          </SidebarGroup>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem
            disabled={!canAdministrate || !onCreateChannel}
            onSelect={(event) => {
              event.preventDefault()
              openCreate("category")
            }}
          >
            <FolderPlusIcon className="size-4" />
            New category
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!canAdministrate || !onCreateChannel}
            onSelect={(event) => {
              event.preventDefault()
              openCreate("text")
            }}
          >
            <HashIcon className="size-4" />
            New text channel
          </ContextMenuItem>
          <ContextMenuItem
            disabled={!canAdministrate || !onCreateChannel}
            onSelect={(event) => {
              event.preventDefault()
              openCreate("voice")
            }}
          >
            <Volume2Icon className="size-4" />
            New voice channel
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DragOverlay>
        {draggedChannel ? (
          <ChannelButton
            channel={draggedChannel}
            isActive={false}
            onSelect={() => {}}
            isDragging
          />
        ) : draggedCategory ? (
          <div className="rounded-md bg-card px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-lg">
            {draggedCategory.name}
          </div>
        ) : null}
      </DragOverlay>
      <Dialog
        open={createOpen !== null}
        onOpenChange={(open) => {
          if (!open) setCreateOpen(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {createOpen === "category"
                ? "New category"
                : createOpen === "voice"
                  ? "New voice channel"
                  : "New text channel"}
            </DialogTitle>
            <DialogDescription>
              {createOpen === "category"
                ? "Group related channels under a label. Categories can be reordered after creation."
                : "Lowercase letters, numbers, and dashes recommended."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3 py-2"
            onSubmit={(event) => {
              event.preventDefault()
              void submitCreate()
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cs-create-channel-name">
                {createOpen === "category" ? "Category name" : "Channel name"}
              </Label>
              <Input
                id="cs-create-channel-name"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                disabled={createBusy}
                placeholder={createOpen === "category" ? "general" : "general"}
              />
            </div>
            {createError ? (
              <div className="text-sm text-destructive">{createError}</div>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateOpen(null)}
                disabled={createBusy}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createBusy || !createName.trim()}>
                {createBusy
                  ? "Creating…"
                  : createOpen === "category"
                    ? "Create category"
                    : createOpen === "voice"
                      ? "Create voice channel"
                      : "Create text channel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}

function sameChannelOrder(left: Channel[], right: Channel[]): boolean {
  if (left.length !== right.length) return false
  return left.every(
    (channel, index) =>
      channel.id === right[index]?.id &&
      channel.categoryId === right[index]?.categoryId
  )
}

function RootChannelsZone({
  channels,
  activeChannelId,
  onSelect,
  onDeleteChannel,
  canAdministrate,
}: {
  channels: Channel[]
  activeChannelId: string
  onSelect: (id: string) => void
  onDeleteChannel?: (channelId: string) => Promise<void>
  canAdministrate: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: ROOT_DROPPABLE_ID,
    data: { accepts: ["channel"] satisfies DraggedKind[] },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-md transition-colors",
        isOver && "bg-sidebar-accent/50",
        channels.length === 0 && "min-h-2"
      )}
    >
      <SortableContext
        items={channels.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <SidebarMenu>
          {channels.map((channel) => (
            <SortableChannel
              key={channel.id}
              channel={channel}
              isActive={channel.id === activeChannelId}
              onSelect={() => onSelect(channel.id)}
              onDeleteChannel={onDeleteChannel}
              canAdministrate={canAdministrate}
            />
          ))}
        </SidebarMenu>
      </SortableContext>
    </div>
  )
}

function SortableCategory({
  category,
  channels,
  activeChannelId,
  onSelect,
  onDeleteChannel,
  canAdministrate,
  onCreateTextChannel,
}: {
  category: ChannelCategory
  channels: Channel[]
  activeChannelId: string
  onSelect: (id: string) => void
  onDeleteChannel?: (channelId: string) => Promise<void>
  canAdministrate: boolean
  onCreateTextChannel?: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: category.id,
    data: {
      kind: "category" satisfies DraggedKind,
      categoryId: category.id,
      accepts: ["category"] satisfies DraggedKind[],
    },
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Droppable zone for the category content (accepts channels)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `cat-zone-${category.id}`,
    data: {
      kind: "category" satisfies DraggedKind,
      isContainer: true,
      accepts: ["channel"] satisfies DraggedKind[],
    },
  })

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible defaultOpen className="group/category">
        <div className="flex items-center justify-between px-2 py-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex size-4 cursor-grab items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground active:cursor-grabbing group-hover/category:opacity-100"
            aria-label={`Drag ${category.name}`}
          >
            <GripVerticalIcon className="size-3" />
          </button>
          <CollapsibleTrigger className="flex flex-1 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground/80 transition-colors hover:text-foreground">
            <ChevronDownIcon className="size-3 transition-transform duration-200 group-data-[state=closed]/category:-rotate-90" />
            <span>{category.name}</span>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="icon-xs"
            title={`Add channel to ${category.name}`}
            className="text-muted-foreground/70 hover:bg-sidebar-accent hover:text-foreground"
            disabled={!onCreateTextChannel}
            onClick={onCreateTextChannel}
          >
            <PlusIcon />
          </Button>
        </div>
        <CollapsibleContent>
          <div
            ref={setDropRef}
            className={cn(
              "rounded-md transition-colors",
              isOver && "bg-sidebar-accent/50",
              channels.length === 0 && "min-h-6"
            )}
          >
            <SortableContext
              items={channels.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <SidebarMenu>
                {channels.map((channel) => (
                  <SortableChannel
                    key={channel.id}
                    channel={channel}
                    isActive={channel.id === activeChannelId}
                    onSelect={() => onSelect(channel.id)}
                    onDeleteChannel={onDeleteChannel}
                    canAdministrate={canAdministrate}
                  />
                ))}
              </SidebarMenu>
            </SortableContext>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function SortableChannel({
  channel,
  isActive,
  onSelect,
  onDeleteChannel,
  canAdministrate,
}: {
  channel: Channel
  isActive: boolean
  onSelect: () => void
  onDeleteChannel?: (channelId: string) => Promise<void>
  canAdministrate: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: channel.id,
    data: {
      kind: "channel" satisfies DraggedKind,
      categoryId: channel.categoryId,
      accepts: ["channel"] satisfies DraggedKind[],
    },
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  // Mockup parity: no visible grip handle on channel rows. The whole
  // row is the drag target via {attributes,listeners} on the outer
  // div. Categories keep their hover-revealed handle. The reason
  // matters beyond aesthetics: with a separate handle button the row
  // hosts two clickable surfaces (drag handle + ChannelButton) that
  // race for pointer events on the hover edge, which on touchpads
  // intermittently captures a drag instead of a click. Keeping drag
  // attached to the row only is also what the prototype validated.
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="min-w-0"
    >
      <ChannelButton
        channel={channel}
        isActive={isActive}
        onSelect={onSelect}
        onDeleteChannel={onDeleteChannel}
        canAdministrate={canAdministrate}
      />
    </div>
  )
}

function ChannelButton({
  channel,
  isActive,
  onSelect,
  onDeleteChannel,
  canAdministrate = false,
  isDragging,
}: {
  channel: Channel
  isActive: boolean
  onSelect: () => void
  onDeleteChannel?: (channelId: string) => Promise<void>
  canAdministrate?: boolean
  isDragging?: boolean
}) {
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteBusy, setDeleteBusy] = React.useState(false)
  const [deleteError, setDeleteError] = React.useState<string | null>(null)
  const hasParticipants =
    channel.kind === "voice" && (channel.participants?.length ?? 0) > 0
  const canDelete = canAdministrate && Boolean(onDeleteChannel)

  const confirmDelete = React.useCallback(async () => {
    if (!onDeleteChannel) return
    setDeleteBusy(true)
    setDeleteError(null)
    try {
      await onDeleteChannel(channel.id)
      setDeleteOpen(false)
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete channel"
      )
    } finally {
      setDeleteBusy(false)
    }
  }, [channel.id, onDeleteChannel])

  return (
    <>
      <ContextMenu>
        <SidebarMenuItem className={cn(isDragging && "rounded-md bg-card shadow-lg")}>
          <ContextMenuTrigger asChild>
            <SidebarMenuButton isActive={isActive} onClick={onSelect}>
              {channel.kind === "voice" ? <Volume2Icon /> : <HashIcon />}
              <span>{channel.name}</span>
            </SidebarMenuButton>
          </ContextMenuTrigger>
          {channel.mentionCount && channel.mentionCount > 0 ? (
            <SidebarMenuBadge className="bg-primary text-primary-foreground peer-data-active/menu-button:text-primary-foreground peer-hover/menu-button:text-primary-foreground">
              {channel.mentionCount > 99 ? "99+" : channel.mentionCount}
            </SidebarMenuBadge>
          ) : channel.unreadCount && channel.unreadCount > 0 ? (
            <SidebarMenuBadge className="bg-muted text-muted-foreground peer-data-active/menu-button:text-foreground peer-hover/menu-button:text-foreground">
              {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
            </SidebarMenuBadge>
          ) : null}
        </SidebarMenuItem>
        <ContextMenuContent className="w-48">
          <ContextMenuItem disabled>
            <SettingsIcon className="size-4" />
            Channel settings
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            disabled={!canDelete}
            onSelect={(event) => {
              event.preventDefault()
              setDeleteError(null)
              setDeleteOpen(true)
            }}
          >
            <TrashIcon className="size-4" />
            Delete channel
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete #{channel.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the channel and its messages. Cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <div className="text-sm text-destructive">{deleteError}</div>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteBusy}
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deleteBusy ? "Deleting..." : "Delete channel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {hasParticipants ? (
        <VoiceParticipantsGroup participants={channel.participants!} />
      ) : null}
    </>
  )
}

const PARTICIPANT_AVATAR_LIMIT = 4

function VoiceParticipantsGroup({
  participants,
}: {
  participants: VoiceParticipant[]
}) {
  const visible = participants.slice(0, PARTICIPANT_AVATAR_LIMIT)
  const overflow = participants.length - visible.length

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div className="flex cursor-default items-center pb-1 pl-7 pt-1.5">
          <div className="flex -space-x-1.5">
            {visible.map((participant) => (
              <span
                key={participant.id}
                className="relative flex size-5 items-center justify-center rounded-full bg-muted text-[9px] font-medium ring-2 ring-sidebar"
              >
                {participant.initials}
                {participant.isMuted ? (
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5 items-center justify-center rounded-full bg-sidebar text-muted-foreground">
                    <MicOffIcon className="size-2" />
                  </span>
                ) : null}
              </span>
            ))}
            {overflow > 0 ? (
              <span className="relative flex size-5 items-center justify-center rounded-full bg-muted text-[9px] font-medium text-muted-foreground ring-2 ring-sidebar">
                +{overflow}
              </span>
            ) : null}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="max-w-xs">
        <ul className="flex flex-col gap-1">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center gap-2 text-xs">
              <span className="flex-1 truncate">{participant.name}</span>
              {participant.isMuted ? (
                <MicOffIcon className="size-3 shrink-0 opacity-70" />
              ) : null}
              {participant.isDeafened ? (
                <HeadphoneOffIcon className="size-3 shrink-0 opacity-70" />
              ) : null}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}

function AppsSection({ apps }: { apps: AppEntry[] }) {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupLabel>Apps</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {apps.map((app) => (
            <SidebarMenuItem key={app.id}>
              <SidebarMenuButton>
                {app.icon}
                <span>{app.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export type { Channel, ChannelCategory, SystemChannel, AppEntry }
export { ScrollTextIcon, ShieldAlertIcon, PuzzleIcon }
