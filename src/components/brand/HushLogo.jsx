/**
 * Hush logo mark (the two vertical bars).
 * Adapts to dark/light via CSS custom properties.
 */
export function HushLogo({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      className={className}
      aria-label="Hush logo"
      role="img"
    >
      <rect x="35" y="22" width="10" height="56" fill="var(--hush-amber)" />
      <rect x="55" y="22" width="10" height="56" fill="var(--hush-amber)" />
    </svg>
  );
}
