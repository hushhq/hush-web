import * as RadixDialog from '@radix-ui/react-dialog';

export const DialogRoot    = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose   = RadixDialog.Close;

export function DialogContent({ title, description, children, ...props }) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="ui-overlay" />
      <RadixDialog.Content
        className="ui-dialog-content"
        {...(description == null && { 'aria-describedby': undefined })}
        {...props}
      >
        {title && (
          <RadixDialog.Title className="ui-dialog-title">
            {title}
          </RadixDialog.Title>
        )}
        {description && (
          <RadixDialog.Description className="ui-dialog-description">
            {description}
          </RadixDialog.Description>
        )}
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export const DialogActions = ({ children }) => (
  <div className="ui-dialog-actions">{children}</div>
);
