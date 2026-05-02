import {
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';

/**
 * ChannelSidebar — channel sidebar of the selected workspace.
 *
 * A real shadcn `Sidebar` primitive (not a legacy inset card). Uses
 * `collapsible="none"` to enforce the pt2 invariant: the channel
 * sidebar is core navigation and must not collapse on desktop. No
 * trigger is exposed.
 *
 * Future iteration (pt3) will move the channel-list internals onto
 * `SidebarHeader` / `SidebarGroup` / `SidebarMenu` primitives. This
 * slice keeps the existing `channelSidebarEl` slot to avoid rewriting
 * domain logic (channel list, voice panel, user panel) in the shell
 * replacement.
 */
export default function ChannelSidebar({ children }) {
  return (
    <Sidebar
      collapsible="none"
      data-slot="channel-sidebar"
      className="h-full w-(--sidebar-width) border-r border-border"
    >
      <SidebarContent
        data-slot="channel-sidebar-content"
        className="p-0"
      >
        {children}
      </SidebarContent>
    </Sidebar>
  );
}
