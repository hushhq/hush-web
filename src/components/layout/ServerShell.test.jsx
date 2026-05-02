import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ServerShell from './ServerShell';

describe('ServerShell', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders TransparencyBlock when transparencyError is present', () => {
    render(
      <ServerShell
        transparencyError="Key mismatch."
        onTransparencySignOut={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: /key verification failed/i })).toBeInTheDocument();
  });

  it('renders the blank app canvas when no transparency error is present', () => {
    const { container } = render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    expect(container.querySelector('[data-slot="blank-app-canvas"]')).toBeInTheDocument();
  });

  it('does not mount any legacy shell, server rail, or channel sidebar slot', () => {
    const { container } = render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    expect(container.querySelector('[data-slot="block-app-shell"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="server-rail"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="channel-sidebar"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="workspace-surface"]')).not.toBeInTheDocument();
  });
});
