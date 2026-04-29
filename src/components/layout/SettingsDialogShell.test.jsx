import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SettingsDialogShell from './SettingsDialogShell';

describe('SettingsDialogShell', () => {
  beforeEach(() => { cleanup(); });

  it('renders the dialog with title, description, nav, and content', () => {
    render(
      <SettingsDialogShell
        title="My settings"
        description="Manage stuff"
        nav={<button type="button">Account</button>}
        onClose={vi.fn()}
      >
        <div data-testid="content">tab body</div>
      </SettingsDialogShell>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('My settings')).toBeInTheDocument();
    expect(screen.getByText('Manage stuff')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /settings navigation/i })).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders the shadcn-managed close button', () => {
    render(
      <SettingsDialogShell title="x" nav={null} onClose={vi.fn()}>
        <div />
      </SettingsDialogShell>,
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed (Radix-managed, no manual listener)', () => {
    const onClose = vi.fn();
    render(
      <SettingsDialogShell title="x" nav={null} onClose={onClose}>
        <div />
      </SettingsDialogShell>,
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <SettingsDialogShell title="x" nav={null} onClose={onClose}>
        <div />
      </SettingsDialogShell>,
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('omits the navigation region when no nav prop is given', () => {
    render(
      <SettingsDialogShell title="x" nav={null} onClose={vi.fn()}>
        <div />
      </SettingsDialogShell>,
    );

    expect(screen.queryByRole('navigation', { name: /settings navigation/i })).toBeNull();
  });
});
