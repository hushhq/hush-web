import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogActions,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/AlertDialog';

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
    <AlertDialogRoot open>
      <AlertDialogContent
        title={title}
        description={message}
        onEscapeKeyDown={() => { if (!loading) onCancel(); }}
      >
        <AlertDialogActions>
          <AlertDialogCancel asChild>
            <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
              {loading && confirmLoadingLabel ? confirmLoadingLabel : confirmLabel}
            </button>
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
