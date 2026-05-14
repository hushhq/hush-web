import { useMemo } from 'react';
import { useDesktopUpdateState } from '@/hooks/useDesktopUpdateState';
import { hasDesktopUpdaterIpc } from '@/hooks/useHasDesktopUpdater';
import { DesktopUpdateGate, isGateVisibleForPhase } from './DesktopUpdateGate.tsx';

/**
 * Synthetic state used to render the gate before the renderer has received its
 * first snapshot or push. Treated as "pending availability decision" so the
 * boundary blocks the underlying auth/PIN/app tree until the controller in
 * main resolves the startup check.
 */
const PENDING_GATE_STATE = Object.freeze({
  phase: 'checking',
  currentVersion: '',
  targetVersion: null,
  progress: null,
  error: null,
});

/**
 * Top-level rendering boundary that hides the entire app tree behind the
 * desktop update gate while:
 *   - the desktop bridge is present AND
 *   - the main-process controller has not yet emitted a settled snapshot OR
 *     has emitted a gate-visible phase (`checking` / `downloading` /
 *     `downloaded`).
 *
 * Fail-open contract — children render normally when any of these is true:
 *   - the renderer is a browser tab (no `window.hushDesktop` bridge);
 *   - the bridge exists but `getDesktopUpdateState` / `onDesktopUpdateState`
 *     are missing (older desktop builds);
 *   - the snapshot phase is `idle`, `skipped`, or `error`.
 *
 * Mounts at the top of the App tree so children (auth providers, route tree,
 * PIN screen, authenticated shell, toasters, dialogs) never mount underneath
 * the gate. This prevents the brief "PIN screen flashes before update gate"
 * race the prompt is specifically trying to close.
 */
export function DesktopUpdateBoundary({ children }) {
  const hasUpdater = useMemo(() => hasDesktopUpdaterIpc(), []);
  const state = useDesktopUpdateState();

  // Browser / older desktop builds without the update IPC: never block.
  if (!hasUpdater) return children;

  // Desktop with updater wired but no first snapshot yet → pending decision.
  if (state === null) return <DesktopUpdateGate state={PENDING_GATE_STATE} />;

  // Settled snapshot in a visible phase → keep blocking until it resolves.
  if (isGateVisibleForPhase(state.phase)) {
    return <DesktopUpdateGate state={state} />;
  }

  // idle / skipped / error → fail open, render normal app.
  return children;
}

export default DesktopUpdateBoundary;
