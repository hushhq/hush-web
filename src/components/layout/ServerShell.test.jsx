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

  it('renders the vanilla sidebar-08 block when no transparency error is present', () => {
    const { container } = renderShell(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
      />,
    );

    // sidebar-08 renders SidebarProvider (data-slot="sidebar-wrapper")
    // wrapping AppSidebar (data-slot="sidebar") and a SidebarInset
    // (data-slot="sidebar-inset"). All three are part of the official
    // block contract.
    expect(container.querySelector('[data-slot="sidebar-wrapper"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sidebar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="sidebar-inset"]')).toBeInTheDocument();
  });

  it('renders the official block sample header (Acme Inc / Enterprise) without Hush data', () => {
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
