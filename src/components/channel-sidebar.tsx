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
  ScrollTextIcon,
  ShieldAlertIcon,
  LogOutIcon,
  PuzzleIcon,
  SettingsIcon,
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

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  onToggleMute: () => void
  onToggleDeafen: () => void
  onDisconnect: () => void
  onJump: () => void
}

interface ChannelSidebarProps {
  serverName: string
  serverPlan?: string
  systemChannels: SystemChannel[]
  categories: ChannelCategory[]
  channels: Channel[]
  apps: AppEntry[]
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
}

const CHANNELS_SECTION_LABEL = "Channels"

export function ChannelSidebar({
  serverName,
  serverPlan,
  systemChannels,
  categories,
  channels,
  apps,
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
          {categories.length > 0 || channels.some((c) => c.categoryId === null) ? (
            <ChannelsSection
              categories={categories}
              channels={channels}
              activeChannelId={activeChannelId}
              onSelect={onSelectChannel}
              onCategoriesChange={onCategoriesChange}
              onChannelsChange={onChannelsChange}
            />
          ) : null}
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
}: {
  name: string
  plan?: string
  railEntries: RailEntry[]
  activeRailId: string
  onSelectRail: (id: string) => void
  onOpenServerSettings?: () => void
}) {
  const [leaveOpen, setLeaveOpen] = React.useState(false)

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
              <ChevronsUpDownIcon className="ml-auto size-4 opacity-70" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
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
              <DropdownMenuSeparator />
            </div>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Server
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => onOpenServerSettings?.()}>
              <SettingsIcon className="size-4" />
              Server settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PlusIcon className="size-4" />
              Invite people
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PuzzleIcon className="size-4" />
              Manage integrations
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
}

function ChannelsSection({
  categories,
  channels,
  activeChannelId,
  onSelect,
  onCategoriesChange,
  onChannelsChange,
}: ChannelsSectionProps) {
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
    for (const cat of categories) map.set(cat.id, [])
    for (const ch of channels) {
      const key = ch.categoryId
      if (!map.has(key)) map.set(key, [])
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
    const { active, over } = event
    if (!over) return
    const activeKind = active.data.current?.kind as DraggedKind | undefined
    if (activeKind !== "channel") return

    const activeChannel = channels.find((c) => c.id === active.id)
    if (!activeChannel) return

    const overData = over.data.current as
      | { kind?: DraggedKind; categoryId?: string | null; isContainer?: boolean }
      | undefined
    let targetCategoryId: string | null | undefined

    if (over.id === ROOT_DROPPABLE_ID) {
      targetCategoryId = null
    } else if (overData?.kind === "category" && overData.isContainer) {
      // Hovering empty category container (collapsible content droppable)
      targetCategoryId = String(over.id).startsWith("cat-zone-")
        ? String(over.id).slice("cat-zone-".length)
        : null
    } else if (overData?.kind === "channel") {
      targetCategoryId = (overData.categoryId ?? null) as string | null
    } else {
      return
    }

    if (activeChannel.categoryId === targetCategoryId) return
    onChannelsChange?.(
      channels.map((c) =>
        c.id === active.id ? { ...c, categoryId: targetCategoryId ?? null } : c
      )
    )
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

      // Reorder within target category subset
      const subset = channels.filter((c) => c.categoryId === targetCategoryId)
      const oldIndex = subset.findIndex((c) => c.id === active.id)
      const overChannelId =
        overData?.kind === "channel" ? String(over.id) : null
      const newIndex = overChannelId
        ? subset.findIndex((c) => c.id === overChannelId)
        : subset.length - 1

      if (oldIndex < 0) {
        return
      }

      const reorderedSubset = arrayMove(subset, oldIndex, Math.max(newIndex, 0))
      const others = channels.filter((c) => c.categoryId !== targetCategoryId)
      onChannelsChange?.([...others, ...reorderedSubset])
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
                  />
                ))}
              </SortableContext>
            </SidebarGroupContent>
          </SidebarGroup>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem>
            <FolderPlusIcon className="size-4" />
            New category
          </ContextMenuItem>
          <ContextMenuItem>
            <HashIcon className="size-4" />
            New text channel
          </ContextMenuItem>
          <ContextMenuItem>
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
    </DndContext>
  )
}

function RootChannelsZone({
  channels,
  activeChannelId,
  onSelect,
}: {
  channels: Channel[]
  activeChannelId: string
  onSelect: (id: string) => void
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
}: {
  category: ChannelCategory
  channels: Channel[]
  activeChannelId: string
  onSelect: (id: string) => void
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
}: {
  channel: Channel
  isActive: boolean
  onSelect: () => void
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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ChannelButton
        channel={channel}
        isActive={isActive}
        onSelect={onSelect}
      />
    </div>
  )
}

function ChannelButton({
  channel,
  isActive,
  onSelect,
  isDragging,
}: {
  channel: Channel
  isActive: boolean
  onSelect: () => void
  isDragging?: boolean
}) {
  const hasParticipants =
    channel.kind === "voice" && (channel.participants?.length ?? 0) > 0

  return (
    <>
      <SidebarMenuItem
        className={cn(isDragging && "rounded-md bg-card shadow-lg")}
      >
        <SidebarMenuButton isActive={isActive} onClick={onSelect}>
          {channel.kind === "voice" ? <Volume2Icon /> : <HashIcon />}
          <span>{channel.name}</span>
        </SidebarMenuButton>
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
