import TransparencyBlock from './TransparencyBlock';
import BlankAppCanvas from './BlankAppCanvas';

/**
 * Top-level authenticated shell.
 *
 * pt4 reset: the shell intentionally renders only one of two states —
 * the transparency hard-fail screen, or a blank canvas. All previous
 * shell composition (server rail, channel sidebar, workspace surface,
 * mobile stack) was removed so the next slice introduces a single
 * official shadcn block from a known-empty baseline.
 */
export default function ServerShell({
  transparencyError,
  onTransparencySignOut,
}) {
  if (transparencyError) {
    return <TransparencyBlock error={transparencyError} onSignOut={onTransparencySignOut} />;
  }

  return <BlankAppCanvas />;
}
