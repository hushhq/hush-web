import * as RadixDropdown from '@radix-ui/react-dropdown-menu';

export const DropdownMenuRoot      = RadixDropdown.Root;
export const DropdownMenuTrigger   = RadixDropdown.Trigger;
export const DropdownMenuSub       = RadixDropdown.Sub;
export const DropdownMenuSeparator = () => <RadixDropdown.Separator className="ui-menu-separator" />;

export function DropdownMenuLabel({ children, ...props }) {
  return (
    <RadixDropdown.Label className="ui-menu-label" {...props}>
      {children}
    </RadixDropdown.Label>
  );
}

export function DropdownMenuContent({ children, ...props }) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content className="ui-menu-content" sideOffset={4} {...props}>
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  );
}

export function DropdownMenuSubTrigger({ children, ...props }) {
  return (
    <RadixDropdown.SubTrigger
      className="ui-menu-item ui-menu-sub-trigger"
      {...props}
    >
      {children}
    </RadixDropdown.SubTrigger>
  );
}

export function DropdownMenuSubContent({ children, ...props }) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.SubContent className="ui-menu-content" sideOffset={2} {...props}>
        {children}
      </RadixDropdown.SubContent>
    </RadixDropdown.Portal>
  );
}

export function DropdownMenuItem({ danger = false, children, ...props }) {
  return (
    <RadixDropdown.Item
      className={`ui-menu-item${danger ? ' ui-menu-item--danger' : ''}`}
      {...props}
    >
      {children}
    </RadixDropdown.Item>
  );
}
