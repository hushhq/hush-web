/**
 * Hush logo mark for in-app surfaces.
 *
 * App icons/favicons own the square background. Inside the product UI the
 * mark is drawn alone so login/auth screens do not look like they contain a
 * nested app icon tile.
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
      <path
        d="M35,22 L45,32 L45,75.5 Q45,78 42.5,78 L37.5,78 Q35,78 35,75.5 Z"
        fill="var(--hush-logo-mark, #EEEEF0)"
      />
      <path
        d="M55,55 L65,65 L65,75.5 Q65,78 62.5,78 L57.5,78 Q55,78 55,75.5 Z"
        fill="var(--hush-logo-mark, #EEEEF0)"
      />
    </svg>
  );
}
