import * as RadixTooltip from '@radix-ui/react-tooltip';

export const TooltipProvider = ({ children, delayDuration = 400, ...props }) => (
  <RadixTooltip.Provider delayDuration={delayDuration} {...props}>
    {children}
  </RadixTooltip.Provider>
);

export const TooltipRoot    = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export function TooltipContent({ children, side = 'top', sideOffset = 6, ...props }) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        className="ui-tooltip-content"
        side={side}
        sideOffset={sideOffset}
        {...props}
      >
        {children}
        <RadixTooltip.Arrow className="ui-tooltip-arrow" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
}

/** Convenience: wraps trigger + tooltip in one component. */
export function Tooltip({ label, side, children }) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{label}</TooltipContent>
    </TooltipRoot>
  );
}
