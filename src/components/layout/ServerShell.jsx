import TransparencyBlock from './TransparencyBlock';
import Sidebar08PreviewFrame from './Sidebar08PreviewFrame';

/**
 * Top-level authenticated shell.
 *
 * pt5 mounted the vanilla shadcn `sidebar-08` block. pt6 wraps it in
 * `Sidebar08PreviewFrame` so the block renders against shadcn's
 * preview environment (full viewport, `.dark` token bridge, scoped
 * shadcn body palette) instead of bleeding through Hush's legacy
 * global body rules. The block markup and sample data stay vanilla.
 *
 * The transparency hard-fail screen still takes precedence when
 * `transparencyError` is set.
 */
export default function ServerShell({
  transparencyError,
  onTransparencySignOut,
}) {
  if (transparencyError) {
    return <TransparencyBlock error={transparencyError} onSignOut={onTransparencySignOut} />;
  }

  return <Sidebar08PreviewFrame />;
}
