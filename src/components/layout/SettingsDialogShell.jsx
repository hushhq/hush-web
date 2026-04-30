import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

/**
 * SettingsDialogShell - reusable centered Dialog island for settings surfaces.
 *
 * Owns:
 *   - Radix-managed open/close (Escape, outside click, focus trap)
 *   - DialogTitle/Description for accessibility
 *   - bounded width/height — never full-screen on desktop
 *   - vertical nav slot beside a scrollable content slot
 *   - shadcn-managed close button (DialogContent default)
 *
 * Layout-only. No business logic, no fetching, no auth. Tab state stays
 * in the consumer (User/ServerSettingsModal).
 */
export default function SettingsDialogShell({
  open = true,
  onOpenChange,
  title,
  description,
  nav,
  children,
  onClose,
  className = '',
}) {
  const handleOpenChange = (next) => {
    onOpenChange?.(next);
    if (!next) {
      onClose?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`settings-dialog-shell flex flex-col gap-0 p-0 inset-0 top-0 left-0 max-w-none max-h-none h-dvh w-screen translate-x-0 translate-y-0 rounded-none sm:fixed sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-3xl sm:max-h-[80vh] sm:h-[80vh] sm:w-full sm:rounded-xl ${className}`}
      >
        <DialogTitle className="settings-dialog-shell__title sr-only">{title}</DialogTitle>
        <DialogDescription className="settings-dialog-shell__description sr-only">
          {description ?? title}
        </DialogDescription>
        <div className="settings-dialog-shell__layout">
          {nav && (
            <nav
              className="settings-dialog-shell__nav"
              aria-label="Settings navigation"
              data-slot="settings-dialog-nav"
            >
              {nav}
            </nav>
          )}
          <ScrollArea
            className="settings-dialog-shell__content settings-dialog-shell__scroll"
            data-slot="settings-dialog-content"
          >
            <div className="settings-dialog-shell__content-inner">{children}</div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
