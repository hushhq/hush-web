import { forwardRef } from 'react';

/**
 * Square icon-only button. Requires aria-label for accessibility.
 */
export const IconButton = forwardRef(function IconButton(
  { className = '', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`btn-icon${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
});
