import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';

export const AlertDialogRoot    = RadixAlertDialog.Root;
export const AlertDialogTrigger = RadixAlertDialog.Trigger;

export function AlertDialogContent({ title, description, children, ...props }) {
  return (
    <RadixAlertDialog.Portal>
      <RadixAlertDialog.Overlay className="ui-overlay" />
      <RadixAlertDialog.Content className="ui-dialog-content" {...props}>
        {title && (
          <RadixAlertDialog.Title className="ui-dialog-title">
            {title}
          </RadixAlertDialog.Title>
        )}
        {description && (
          <RadixAlertDialog.Description className="ui-dialog-description">
            {description}
          </RadixAlertDialog.Description>
        )}
        {children}
      </RadixAlertDialog.Content>
    </RadixAlertDialog.Portal>
  );
}

export const AlertDialogAction = RadixAlertDialog.Action;
export const AlertDialogCancel = RadixAlertDialog.Cancel;
export const AlertDialogActions = ({ children }) => (
  <div className="ui-dialog-actions">{children}</div>
);
