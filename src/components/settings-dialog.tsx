import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator.tsx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SettingsSection {
  id: string
  label: string
  icon: React.ReactNode
  content: React.ReactNode
  groupId?: string
  destructive?: boolean
}

export interface SettingsGroup {
  id: string
  label?: string
}

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  sections: SettingsSection[]
  groups?: SettingsGroup[]
  defaultSectionId?: string
}

export function SettingsDialog({
  open,
  onOpenChange,
  title,
  description,
  sections,
  groups,
  defaultSectionId,
}: SettingsDialogProps) {
  const [activeId, setActiveId] = React.useState<string>(
    defaultSectionId ?? sections[0]?.id ?? ""
  )

  React.useEffect(() => {
    if (!open) return
    setActiveId(defaultSectionId ?? sections[0]?.id ?? "")
  }, [open, defaultSectionId, sections])

  const active = sections.find((s) => s.id === activeId) ?? sections[0]

  const grouped = React.useMemo(() => {
    if (!groups?.length) return [{ id: "_default", label: undefined, items: sections }]
    return groups.map((g) => ({
      id: g.id,
      label: g.label,
      items: sections.filter((s) => (s.groupId ?? "_default") === g.id),
    }))
  }, [groups, sections])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[36rem] overflow-hidden p-0 md:max-w-3xl lg:max-w-4xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        ) : null}
        <SidebarProvider className="h-full min-h-0 items-stretch">
          <Sidebar collapsible="none" className="hidden w-56 md:flex">
            <SidebarContent>
              {grouped.map((group) => (
                <SidebarGroup key={group.id}>
                  {group.label ? (
                    <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </div>
                  ) : null}
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((section) => (
                        <SidebarMenuItem key={section.id}>
                          <SidebarMenuButton
                            isActive={section.id === activeId}
                            onClick={() => setActiveId(section.id)}
                            className={cn(
                              section.destructive &&
                                "text-destructive hover:text-destructive data-[active=true]:text-destructive"
                            )}
                          >
                            {section.icon}
                            <span>{section.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
          <main className="flex flex-1 flex-col overflow-hidden">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 text-sm">
              <span className="text-muted-foreground">{title}</span>
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-4"
              />
              {/* Mobile: render the section list as a Select so users
                  on <md viewports — where the sidebar is hidden —
                  can still switch panels. Desktop keeps the static
                  label since the sidebar already exposes the full
                  list. */}
              <span className="hidden font-medium md:inline">
                {active?.label}
              </span>
              <div className="flex flex-1 justify-end md:hidden">
                <Select
                  value={active?.id}
                  onValueChange={(next) => setActiveId(next)}
                >
                  <SelectTrigger size="sm" className="w-44">
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {grouped.map((group) => (
                      <SelectGroup key={group.id}>
                        {group.label ? (
                          <SelectLabel>{group.label}</SelectLabel>
                        ) : null}
                        {group.items.map((section) => (
                          <SelectItem
                            key={section.id}
                            value={section.id}
                            className={cn(
                              section.destructive && "text-destructive"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              {section.icon}
                              {section.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              {active?.content}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
