import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { TooltipProvider } from '../ui/tooltip';
import ServerShell from './ServerShell';

function renderShell(ui) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe('ServerShell', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders TransparencyBlock when transparencyError is present', () => {
    renderShell(
      <ServerShell
        transparencyError="Key mismatch."
        onTransparencySignOut={vi.fn()}
      />,
    );

    expect(screen.getByRole('heading', { name: /key verification failed/i })).toBeInTheDocument();
  });

  it('renders the sidebar-08 preview wrapper around the vanilla block', () => {
    const { container } = renderShell(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    const frame = container.querySelector('[data-slot="sidebar-08-preview-frame"]');
    expect(frame).toBeInTheDocument();
    // Preview wrapper owns the dark token bridge + viewport sizing.
    expect(frame).toHaveClass('dark');
    expect(frame).toHaveClass('h-svh');
    expect(frame).toHaveClass('bg-background');
    expect(frame).toHaveClass('text-foreground');
    // Block contract still present inside the wrapper.
    expect(frame?.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    expect(frame?.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    expect(frame?.querySelector('[data-slot="sidebar-inset"]')).toBeInTheDocument();
  });

  it('preserves the block sample data verbatim (Acme Inc / Enterprise)', () => {
    renderShell(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    expect(screen.getByText('Acme Inc')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });
});
