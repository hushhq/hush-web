/**
 * BlankAppCanvas — pt4 demolition surface.
 *
 * Full-viewport blank canvas using shadcn theme tokens. The
 * authenticated app deliberately renders nothing else here so the next
 * slice (pt5) can introduce a single official shadcn block from a
 * known-empty starting point.
 *
 * No product UI, no Hush widgets, no shell scaffolding.
 */
export default function BlankAppCanvas() {
  return (
    <div
      data-slot="blank-app-canvas"
      className="h-svh w-full bg-background text-foreground"
    />
  );
}
