import * as RadixSelect from '@radix-ui/react-select';

export const SelectRoot = RadixSelect.Root;

export function SelectTrigger({ placeholder, children, ...props }) {
  return (
    <RadixSelect.Trigger className="ui-select-trigger" {...props}>
      <RadixSelect.Value placeholder={placeholder} />
      {children}
    </RadixSelect.Trigger>
  );
}

export function SelectContent({ children, ...props }) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content className="ui-select-content" {...props}>
        <RadixSelect.Viewport>
          {children}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}

export function SelectItem({ value, children, ...props }) {
  return (
    <RadixSelect.Item className="ui-select-item" value={value} {...props}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

export const SelectGroup = RadixSelect.Group;
export const SelectLabel = RadixSelect.Label;
