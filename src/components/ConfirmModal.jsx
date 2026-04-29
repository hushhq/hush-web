import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

/**
 * Generic destructive confirmation dialog.
 * Always rendered open; mount/unmount controls visibility.
 *
 * Callback contract:
 *   onConfirm — fired only on explicit confirm click
 *   onCancel  — fired on cancel click or Escape key, never on confirm
 *
 * Loading contract:
 *   loading=true — disables both buttons, blocks Escape, shows confirmLoadingLabel if provided
 */
export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  confirmLoadingLabel,
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AlertDialog open>
      <AlertDialogContent
        onEscapeKeyDown={(event) => {
          if (loading) {
            event.preventDefault();
            return;
          }
          onCancel();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            onClick={(event) => {
              if (loading) {
                event.preventDefault();
                return;
              }
              onCancel();
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={loading}
            onClick={(event) => {
              if (loading) {
                event.preventDefault();
                return;
              }
              onConfirm();
            }}
          >
            {loading && confirmLoadingLabel ? confirmLoadingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
