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

  it('renders the sidebar-08 docs-style preview frame around the vanilla block', () => {
    const { container } = renderShell(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    const frame = container.querySelector('[data-slot="sidebar-08-preview-frame"]');
    expect(frame).toBeInTheDocument();
    // Outer canvas: `.dark` activates the variant bridge, `bg-muted/40`
    // paints the visible page padding around the windowed app frame.
    expect(frame).toHaveClass('dark');
    expect(frame).toHaveClass('h-svh');
    expect(frame).toHaveClass('bg-muted/40');

    // Inner app frame: rounded clipped surface that contains the block.
    const inner = container.querySelector('[data-slot="sidebar-08-preview-frame-inner"]');
    expect(inner).toBeInTheDocument();
    expect(inner).toHaveClass('rounded-xl');
    expect(inner).toHaveClass('border');
    expect(inner).toHaveClass('bg-background');
    expect(inner).toHaveClass('overflow-hidden');

    // Block contract still present inside the inner frame.
    expect(inner?.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    expect(inner?.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    expect(inner?.querySelector('[data-slot="sidebar-inset"]')).toBeInTheDocument();
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
