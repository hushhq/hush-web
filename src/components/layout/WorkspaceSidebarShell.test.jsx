import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import WorkspaceSidebarShell from './WorkspaceSidebarShell';

describe('WorkspaceSidebarShell', () => {
  beforeEach(() => { cleanup(); });

  it('renders content slot inside the content region', () => {
    const { container } = render(
      <WorkspaceSidebarShell
        content={<div data-testid="content">channels</div>}
      />,
    );
    const contentRegion = container.querySelector('[data-slot="workspace-sidebar-content"]');
    expect(contentRegion).toBeInTheDocument();
    expect(contentRegion?.contains(screen.getByTestId('content'))).toBe(true);
  });

  it('renders footer slot in the footer region, outside the content region', () => {
    const { container } = render(
      <WorkspaceSidebarShell
        content={<div data-testid="content" />}
        footer={<div data-testid="footer">user-panel</div>}
      />,
    );
    const footerRegion = container.querySelector('[data-slot="workspace-sidebar-footer"]');
    const contentRegion = container.querySelector('[data-slot="workspace-sidebar-content"]');
    expect(footerRegion).toBeInTheDocument();
    expect(footerRegion?.contains(screen.getByTestId('footer'))).toBe(true);
    expect(contentRegion?.contains(screen.getByTestId('footer'))).toBe(false);
  });

  it('omits the header region when no header prop is given', () => {
    const { container } = render(<WorkspaceSidebarShell content={<div />} />);
    expect(container.querySelector('[data-slot="workspace-sidebar-header"]')).not.toBeInTheDocument();
  });

  it('renders the header region when header prop is given', () => {
    const { container } = render(
      <WorkspaceSidebarShell
        header={<div data-testid="header">title</div>}
        content={<div />}
      />,
    );
    const headerRegion = container.querySelector('[data-slot="workspace-sidebar-header"]');
    expect(headerRegion).toBeInTheDocument();
    expect(headerRegion?.contains(screen.getByTestId('header'))).toBe(true);
  });

  it('keeps the legacy `.sidebar-shell` class hook for visual continuity', () => {
    const { container } = render(<WorkspaceSidebarShell content={<div />} />);
    expect(container.querySelector('.workspace-sidebar-shell.sidebar-shell')).toBeInTheDocument();
  });
});
