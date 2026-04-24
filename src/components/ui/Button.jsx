import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

/**
 * Thin wrapper around the .btn class hierarchy.
 * variant: 'primary' | 'secondary' | 'danger'
 * asChild: render as child element (Radix Slot pattern) instead of <button>
 */
export const Button = forwardRef(function Button(
  { variant = 'secondary', className = '', asChild = false, children, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      {...(!asChild && { type: 'button' })}
      className={`btn btn-${variant}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </Comp>
  );
});
