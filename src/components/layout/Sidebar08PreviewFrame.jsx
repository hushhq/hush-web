import Sidebar08Block from './Sidebar08Block';

/**
 * Sidebar08PreviewFrame — preview canvas around the vanilla
 * `sidebar-08` block.
 *
 * Reproduces the structural environment of the shadcn block preview
 * (visible outer page padding, a rounded clipped app frame, the inset
 * sidebar/main surfaces inside that frame) without modifying the
 * block itself.
 *
 * Layered responsibilities:
 *   - Outer canvas: full viewport `bg-muted/40` with padding so the
 *     app frame is clearly inset from the page edge.
 *   - App frame: `rounded-xl border bg-background overflow-hidden`
 *     so the entire `Sidebar08Block` reads as a single windowed
 *     surface, exactly like the shadcn preview tile.
 *   - `.dark` ancestor so shadcn `dark:` variants resolve under
 *     Hush's `@custom-variant dark (&:is(.dark *))` bridge.
 *
 * The `SidebarProvider` inside the block ships `min-h-svh w-full`,
 * which would overflow this windowed frame. Scoped CSS in
 * `global.css` (under `[data-slot="sidebar-08-preview-frame"]`)
 * relaxes the wrapper to `min-height: 100%; height: 100%` so the
 * block fits the frame without altering block source.
 *
 * Scope is intentionally narrow. Hush theming will retire this
 * wrapper deliberately.
 */
export default function Sidebar08PreviewFrame() {
  return (
    <div
      data-slot="sidebar-08-preview-frame"
      className="dark flex h-svh w-full items-stretch bg-muted/40 p-4 antialiased text-foreground sm:p-6"
    >
      <div
        data-slot="sidebar-08-preview-frame-inner"
        className="relative flex h-full w-full overflow-hidden rounded-xl border border-border bg-background text-sm shadow-2xl"
      >
        <Sidebar08Block />
      </div>
    </div>
  );
}
