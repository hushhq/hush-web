import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '../ui/sidebar.tsx';

/**
 * WorkspaceSidebarShell - explicit header / content / footer composition for
 * the desktop workspace sidebar (channel list or DM list + voice + user
 * panels).
 *
 * Layout-only: no fetching, no auth, no voice mutation, no routing.
 * Footer stays anchored; only the content region scrolls (its inner pane
 * owns the actual scroll container, e.g. `.cl-channel-list` or DM list scroll).
 *
 * Reuses the legacy `.sidebar-shell` wrapper class for visual continuity
 * (border + radius) plus `.workspace-sidebar-shell*` markers so future
 * phases can target the new contract directly.
 */
export default function WorkspaceSidebarShell({ header = null, content, footer = null }) {
  return (
    <div className="workspace-sidebar-shell sidebar-shell">
      {header && (
        <SidebarHeader
          className="workspace-sidebar-shell__header"
          data-slot="workspace-sidebar-header"
        >
          {header}
        </SidebarHeader>
      )}
      <SidebarContent
        className="workspace-sidebar-shell__content"
        data-slot="workspace-sidebar-content"
      >
        {content}
      </SidebarContent>
      {footer && (
        <SidebarFooter
          className="workspace-sidebar-shell__footer"
          data-slot="workspace-sidebar-footer"
        >
          {footer}
        </SidebarFooter>
      )}
    </div>
  );
}
