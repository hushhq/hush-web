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
        className={`settings-dialog-shell sm:max-w-3xl max-h-[80vh] h-[80vh] flex flex-col gap-0 p-0 ${className}`}
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
