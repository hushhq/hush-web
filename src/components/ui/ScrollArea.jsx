import * as RadixScroll from '@radix-ui/react-scroll-area';

/**
 * Drop-in replacement for overflow: auto containers.
 * className/style apply to the root element.
 */
export function ScrollArea({ children, className = '', style, ...props }) {
  return (
    <RadixScroll.Root
      className={`ui-scroll-area-root${className ? ` ${className}` : ''}`}
      style={style}
      {...props}
    >
      <RadixScroll.Viewport className="ui-scroll-area-viewport">
        {children}
      </RadixScroll.Viewport>
      <RadixScroll.Scrollbar
        className="ui-scroll-area-scrollbar"
        orientation="vertical"
      >
        <RadixScroll.Thumb className="ui-scroll-area-thumb" />
      </RadixScroll.Scrollbar>
      <RadixScroll.Scrollbar
        className="ui-scroll-area-scrollbar"
        orientation="horizontal"
      >
        <RadixScroll.Thumb className="ui-scroll-area-thumb" />
      </RadixScroll.Scrollbar>
      <RadixScroll.Corner />
    </RadixScroll.Root>
  );
}
