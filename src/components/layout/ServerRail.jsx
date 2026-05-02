/**
 * ServerRail — persistent narrow icon rail for server/guild navigation.
 *
 * Sits OUTSIDE the inset workspace frame so the rail stays continuous
 * while the framed workspace contour switches between selected guilds.
 *
 * The rail intentionally hosts the existing `serverListEl` slot rather
 * than re-implementing server picker UI — the legacy `ServerList` owns
 * domain logic (instances, DMs, drag-and-drop ordering) that is out of
 * scope for the shell rewrite. The rail provides the chrome contract:
 * fixed width, edge-to-edge background, hairline trailing border.
 */
export default function ServerRail({ children }) {
  return (
    <aside
      data-slot="server-rail"
      aria-label="Server navigation"
      className="flex h-full w-[72px] shrink-0 flex-col border-r border-border bg-background"
    >
      {children}
    </aside>
  );
}
