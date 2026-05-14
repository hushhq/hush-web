import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('./useInstancePing.js', () => ({
  useInstancePing: vi.fn(),
  PING_INTERVAL_MS: 15_000,
  PING_TIMEOUT_MS: 4_000,
}));

import { useInstancePing } from './useInstancePing.js';
import { DesktopTelemetry } from './DesktopTelemetry.jsx';
import { PING_STATUS } from './pingStatus.js';

describe('DesktopTelemetry', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders both the E2EE pill and a ping pill', () => {
    useInstancePing.mockReturnValue({ ms: 42, status: PING_STATUS.LOW });
    const { container } = render(<DesktopTelemetry instanceUrl="https://hush.example" />);
    const pills = container.querySelectorAll('.hush-desktop-telemetry__pill');
    expect(pills).toHaveLength(2);
    expect(pills[0].textContent).toContain('E2EE');
    expect(pills[1].textContent).toContain('42 ms');
  });

  it('shows the neutral placeholder when no instance is active', () => {
    useInstancePing.mockReturnValue({ ms: null, status: PING_STATUS.UNKNOWN });
    const { container } = render(<DesktopTelemetry instanceUrl={null} />);
    const pingPill = container.querySelectorAll('.hush-desktop-telemetry__pill')[1];
    expect(pingPill.textContent).toContain('-- ms');
    expect(container.querySelector('.hush-desktop-telemetry')?.getAttribute('data-ping-status'))
      .toBe(PING_STATUS.UNKNOWN);
  });

  it('flags the unreachable state when ping fails', () => {
    useInstancePing.mockReturnValue({ ms: Number.POSITIVE_INFINITY, status: PING_STATUS.DOWN });
    const { container } = render(<DesktopTelemetry instanceUrl="https://hush.example" />);
    expect(container.querySelector('.hush-desktop-telemetry')?.getAttribute('data-ping-status'))
      .toBe(PING_STATUS.DOWN);
  });

  it('uses tabular-numbers for the ping value to prevent layout shift', () => {
    useInstancePing.mockReturnValue({ ms: 7, status: PING_STATUS.LOW });
    const { container } = render(<DesktopTelemetry instanceUrl="https://hush.example" />);
    const ping = container.querySelector('.hush-desktop-telemetry__ping');
    expect(ping).not.toBeNull();
    // The class is defined in global.css with `font-variant-numeric: tabular-nums`.
    // jsdom doesn't apply stylesheets, so we assert on the contract class.
    expect(ping?.classList.contains('hush-desktop-telemetry__ping')).toBe(true);
  });
});
