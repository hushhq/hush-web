import * as RadixContext from '@radix-ui/react-context-menu';

export const ContextMenuRoot      = RadixContext.Root;
export const ContextMenuTrigger   = RadixContext.Trigger;
export const ContextMenuSeparator = () => <RadixContext.Separator className="ui-menu-separator" />;

export function ContextMenuContent({ children, ...props }) {
  return (
    <RadixContext.Portal>
      <RadixContext.Content className="ui-menu-content" {...props}>
        {children}
      </RadixContext.Content>
    </RadixContext.Portal>
  );
}

export function ContextMenuItem({ danger = false, children, ...props }) {
  return (
    <RadixContext.Item
      className={`ui-menu-item${danger ? ' ui-menu-item--danger' : ''}`}
      {...props}
    >
      {children}
    </RadixContext.Item>
  );
}
