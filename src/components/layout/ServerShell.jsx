import TransparencyBlock from './TransparencyBlock';
import Sidebar08Block from './Sidebar08Block';

/**
 * Top-level authenticated shell.
 *
 * pt5: the authenticated app renders the vanilla shadcn `sidebar-08`
 * block (`Sidebar08Block`) — no Hush data, no theming changes, no
 * customization beyond import-path fixes required by this repo. The
 * transparency hard-fail screen still takes precedence when
 * `transparencyError` is set.
 */
export default function ServerShell({
  transparencyError,
  onTransparencySignOut,
}) {
  if (transparencyError) {
    return <TransparencyBlock error={transparencyError} onSignOut={onTransparencySignOut} />;
  }

  return <Sidebar08Block />;
}
