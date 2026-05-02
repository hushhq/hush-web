import { SidebarInset } from '@/components/ui/sidebar';

/**
 * WorkspaceSurface — main channel-view surface of the inset frame.
 *
 * Wraps the active channel content (`children`) in shadcn's
 * `SidebarInset` so the workspace shares a consistent block-native
 * scaffolding with the rest of the inset frame. The legacy
 * `ChannelContent` element is rendered as `children` — its internals
 * (TextChannel, VoiceChannel, headers, member drawer) keep their
 * existing data wiring.
 */
export default function WorkspaceSurface({ children }) {
  return (
    <SidebarInset
      data-slot="workspace-surface"
      className="min-w-0 flex-1 bg-background"
    >
      {children}
    </SidebarInset>
  );
}
