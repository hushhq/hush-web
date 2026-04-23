import * as RadixSeparator from '@radix-ui/react-separator';

export function Separator({ orientation = 'horizontal', ...props }) {
  return (
    <RadixSeparator.Root
      className="ui-separator"
      orientation={orientation}
      decorative
      {...props}
    />
  );
}
