import { useMemo, type ReactElement } from 'react';
import { Progress } from '@/components/ui/progress';
import { useDesktopUpdateState } from '@/hooks/useDesktopUpdateState';

/**
 * Phases for which the renderer must render a non-dismissible update gate.
 *
 * Duplicated here (and not imported from `hush-desktop/src/shared/desktop-update`)
 * because the web bundle is built independently and must not cross-import from
 * the desktop package at build time. The desktop package owns the canonical
 * predicate (`isDesktopUpdateGateVisible`) and the two MUST be kept in sync.
 */
const VISIBLE_PHASES = new Set(['checking', 'downloading', 'downloaded']);

interface DesktopUpdateProgressLike {
  readonly percent: number;
  readonly transferred: number;
  readonly total: number;
  readonly bytesPerSecond: number;
}

interface DesktopUpdateStateLike {
  readonly phase: string;
  readonly currentVersion: string;
  readonly targetVersion: string | null;
  readonly progress: DesktopUpdateProgressLike | null;
}

interface CopyBlock {
  readonly title: string;
  readonly description: string;
}

const COPY: Record<'checking' | 'downloading' | 'downloaded', CopyBlock> = {
  checking: {
    title: 'Checking for desktop update...',
    description: 'Preparing your install. This will only take a moment.',
  },
  downloading: {
    title: 'Installing desktop update',
    description: 'Download in progress. The app will restart automatically when it finishes.',
  },
  downloaded: {
    title: 'Restarting to finish update...',
    description: 'Hush is relaunching with the new version.',
  },
};

/**
 * Non-dismissible full-screen gate that overlays every other surface (login,
 * PIN unlock, authenticated shell) while the desktop auto-updater runs.
 *
 * The gate is rendered above the app shell. It uses semantic theme tokens
 * (`bg-background`, `text-foreground`, `text-muted-foreground`) so it adapts
 * to light/dark mode without per-theme code paths. There is no close button,
 * no Escape handler, and no overlay click-through — the user can only exit
 * by completing the install or by an explicit fail-open transition emitted
 * from the main process.
 *
 * Renders `null` in the browser, in dev (idle state), or after a fail-open
 * (skipped / error) so the underlying app remains fully interactive.
 */
export function DesktopUpdateGate(): ReactElement | null {
  const rawState = useDesktopUpdateState() as DesktopUpdateStateLike | null;

  const view = useMemo(() => computeView(rawState), [rawState]);
  if (!view) return null;

  return (
    <div
      data-testid="desktop-update-gate"
      data-phase={view.phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-update-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="flex w-full max-w-md flex-col gap-6 px-6 text-center">
        <div className="flex flex-col gap-2">
          <h1
            id="desktop-update-title"
            className="text-lg font-semibold text-foreground"
          >
            {view.title}
          </h1>
          <p className="text-sm text-muted-foreground">{view.description}</p>
        </div>

        <Progress value={view.percent} data-testid="desktop-update-progress" />

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {view.progressLabel && (
            <span data-testid="desktop-update-progress-label">{view.progressLabel}</span>
          )}
          <span data-testid="desktop-update-version-label" className="font-mono">
            {view.versionLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ViewModel {
  readonly phase: 'checking' | 'downloading' | 'downloaded';
  readonly title: string;
  readonly description: string;
  readonly percent: number;
  readonly progressLabel: string | null;
  readonly versionLabel: string;
}

function computeView(state: DesktopUpdateStateLike | null): ViewModel | null {
  if (!state) return null;
  if (!VISIBLE_PHASES.has(state.phase)) return null;

  const phase = state.phase as ViewModel['phase'];
  const copy = COPY[phase];
  const percent = clampPercent(state.progress?.percent);
  const progressLabel = formatProgressLabel(phase, state.progress);
  const versionLabel = formatVersionLabel(state.currentVersion, state.targetVersion);

  return {
    phase,
    title: copy.title,
    description: copy.description,
    percent,
    progressLabel,
    versionLabel,
  };
}

function clampPercent(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function formatProgressLabel(
  phase: ViewModel['phase'],
  progress: DesktopUpdateProgressLike | null | undefined,
): string | null {
  if (phase !== 'downloading') return null;
  if (!progress) return null;
  const percent = clampPercent(progress.percent);
  const transferred = formatBytes(progress.transferred);
  const total = formatBytes(progress.total);
  if (progress.total > 0) {
    return `${percent.toFixed(0)}% · ${transferred} of ${total}`;
  }
  return `${percent.toFixed(0)}% · ${transferred}`;
}

function formatVersionLabel(current: string, target: string | null): string {
  if (target && target.length > 0) return `${current} -> ${target}`;
  return current;
}

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const precision = value >= 100 || unit === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${BYTE_UNITS[unit]}`;
}

export default DesktopUpdateGate;
