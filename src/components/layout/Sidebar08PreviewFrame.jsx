import Sidebar08Block from './Sidebar08Block';

/**
 * Sidebar08PreviewFrame — pt6 preview environment around the vanilla
 * `sidebar-08` block.
 *
 * Hush's global stylesheet (`src/styles/global.css`) sets unlayered
 * body rules (`background-color: var(--hush-black)`, `color:
 * var(--hush-text)`, `font-size: 13px`) that shadow the
 * `@layer base { body { @apply bg-background text-foreground } }`
 * baseline shadcn primitives are designed against, and the document
 * tree never carries a `.dark` class so the `@custom-variant dark
 * (&:is(.dark *))` bridge is dormant — meaning shadcn `dark:`
 * variants never fire even though the `:root` tokens are already the
 * dark palette.
 *
 * This wrapper restores the official preview environment for the
 * block without changing block markup or sample data:
 *   - `.dark` class so shadcn dark-variant utilities resolve.
 *   - Full viewport sizing (`h-svh w-full`) so the block frames the
 *     whole window, matching the shadcn preview.
 *   - `bg-background text-foreground` at the wrapper level so the
 *     body's legacy Hush palette stops bleeding through inside the
 *     block's region.
 *   - `text-sm` baseline so the block's typography reads at shadcn's
 *     default scale instead of Hush's `13px` body size.
 *   - `antialiased` to match shadcn preview rendering.
 *
 * Scope is intentionally narrow: nothing here is Hush-specific. A
 * future Hush theming pass replaces this wrapper deliberately.
 */
export default function Sidebar08PreviewFrame() {
  return (
    <div
      data-slot="sidebar-08-preview-frame"
      className="dark h-svh w-full bg-background text-sm text-foreground antialiased"
    >
      <Sidebar08Block />
    </div>
  );
}
