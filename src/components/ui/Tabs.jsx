import * as RadixTabs from '@radix-ui/react-tabs';

export const TabsRoot = RadixTabs.Root;

export function TabsList({ children, ...props }) {
  return (
    <RadixTabs.List className="ui-tabs-list" {...props}>
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({ value, children, ...props }) {
  return (
    <RadixTabs.Trigger className="ui-tabs-trigger" value={value} {...props}>
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabsContent({ value, children, ...props }) {
  return (
    <RadixTabs.Content className="ui-tabs-content" value={value} {...props}>
      {children}
    </RadixTabs.Content>
  );
}
