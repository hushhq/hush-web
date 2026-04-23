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
 */
export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <AlertDialogRoot open>
      <AlertDialogContent
        title={title}
        description={message}
        onEscapeKeyDown={onCancel}
      >
        <AlertDialogActions>
          <AlertDialogCancel asChild>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </AlertDialogAction>
        </AlertDialogActions>
      </AlertDialogContent>
    </AlertDialogRoot>
  );
}
