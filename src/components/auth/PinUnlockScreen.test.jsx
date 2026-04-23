import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinUnlockScreen } from './PinUnlockScreen';

describe('PinUnlockScreen', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders username in identity section', () => {
    render(
      <PinUnlockScreen
        username="alice"
        onUnlock={vi.fn()}
        onSwitchAccount={vi.fn()}
      />,
    );
    expect(screen.getByText('alice')).toBeInTheDocument();
  });

  it('submit button is disabled when PIN is empty', () => {
    render(
      <PinUnlockScreen
        username="alice"
        onUnlock={vi.fn()}
        onSwitchAccount={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /unlock/i })).toBeDisabled();
  });

  it('submit button is enabled when PIN has 4+ digits', async () => {
    const user = userEvent.setup();
    render(
      <PinUnlockScreen
        username="alice"
        onUnlock={vi.fn()}
        onSwitchAccount={vi.fn()}
      />,
    );
    await user.type(screen.getByLabelText('Vault PIN'), '1234');
    expect(screen.getByRole('button', { name: /unlock/i })).toBeEnabled();
  });

  it('does not render an alert when there is no error message', () => {
    render(
      <PinUnlockScreen
        username="alice"
        onUnlock={vi.fn()}
        onSwitchAccount={vi.fn()}
        attemptCount={1}
      />,
    );
    // No error initially
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('PIN input has accessible label', () => {
    render(
      <PinUnlockScreen
        username="alice"
        onUnlock={vi.fn()}
        onSwitchAccount={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Vault PIN')).toBeInTheDocument();
  });
});
