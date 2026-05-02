import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';

/**
 * ChannelSidebar — channel sidebar of the selected workspace.
 *
 * Real shadcn `Sidebar` primitive (not a legacy inset card). Uses
 * `collapsible="none"` to enforce the pt2 invariant: the channel
 * sidebar is core navigation and must not collapse on desktop, and no
 * trigger is exposed.
 *
 * Slots are split into `body` and `footer` so the footer (voice
 * connected panel + user panel) stays anchored at the bottom while
 * the body owns its own scroll surface. The legacy
 * `WorkspaceSidebarShell` wrapper was retired in pt3 — its
 * SidebarHeader / SidebarContent / SidebarFooter contract now lives
 * directly here.
 *
 * The server-name menu and admin actions still ship inside the body
 * (rendered by `ChannelList`'s internal `.cl-header`). pt3 escape
 * clause: deeper migration of the menu into a `SidebarHeader` is
 * deferred to pt4 because lifting `ChannelList` state would drag in
 * invite/settings/create-channel modal wiring out of scope.
 */
export default function ChannelSidebar({ children, footer = null }) {
  return (
    <Sidebar
      collapsible="none"
      data-slot="channel-sidebar"
      className="h-full w-(--sidebar-width) border-r border-border bg-sidebar"
    >
      <SidebarContent
        data-slot="channel-sidebar-content"
        className="min-h-0 flex-1 p-0"
      >
        {children}
      </SidebarContent>
      {footer && (
        <SidebarFooter
          data-slot="channel-sidebar-footer"
          className="gap-0 border-t border-border bg-sidebar p-0"
        >
          {footer}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
