import { forwardRef } from 'react';

/**
 * Thin wrapper around the .btn class hierarchy.
 * variant: 'primary' | 'secondary' | 'danger'
 */
export const Button = forwardRef(function Button(
  { variant = 'secondary', className = '', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`btn btn-${variant}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
});
