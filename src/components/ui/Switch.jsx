import * as RadixSwitch from '@radix-ui/react-switch';

export function Switch({ id, checked, onCheckedChange, disabled, ...props }) {
  return (
    <RadixSwitch.Root
      id={id}
      className="ui-switch-root"
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      {...props}
    >
      <RadixSwitch.Thumb className="ui-switch-thumb" />
    </RadixSwitch.Root>
  );
}
