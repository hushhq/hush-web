/**
 * PinSetupModal.test.jsx
 *
 * Covers behavioral structure of the PIN/passphrase setup flow:
 *   - PIN tab active by default
 *   - Switching to passphrase tab shows passphrase-specific fields
 *   - Switching tabs resets value and confirm fields
 *   - Submit is disabled until confirm matches value and meets min length
 *   - Mismatch alert shown when confirm differs from value
 *   - Successful submit calls onSetPin with the entered value
 *   - Skip button calls onSkip when provided
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinSetupModal } from './PinSetupModal.jsx';

afterEach(cleanup);

function renderModal(overrides = {}) {
  const props = {
    onSetPin: vi.fn().mockResolvedValue(undefined),
    onSkip: vi.fn(),
    isLoading: false,
    ...overrides,
  };
  render(<PinSetupModal {...props} />);
  return props;
}

describe('PinSetupModal', () => {
  describe('initial state', () => {
    it('shows PIN tab as active by default', () => {
      renderModal();
      const pinTab = screen.getByRole('tab', { name: /use a pin/i });
      expect(pinTab).toHaveAttribute('data-state', 'active');
    });

    it('shows passphrase tab as inactive by default', () => {
      renderModal();
      const phraseTab = screen.getByRole('tab', { name: /use a passphrase/i });
      expect(phraseTab).toHaveAttribute('data-state', 'inactive');
    });

    it('submit is disabled with empty fields', () => {
      renderModal();
      expect(screen.getByRole('button', { name: /set pin/i })).toBeDisabled();
    });
  });

  describe('PIN mode', () => {
    it('enables submit when PIN and confirm match and meet min length', async () => {
      const user = userEvent.setup();
      renderModal();
      await user.type(screen.getByLabelText(/pin \(min 4 digits\)/i), '1234');
      await user.type(screen.getByLabelText(/confirm pin/i), '1234');
      expect(screen.getByRole('button', { name: /set pin/i })).not.toBeDisabled();
    });

    it('shows mismatch alert when confirm differs from value', async () => {
      const user = userEvent.setup();
      renderModal();
      await user.type(screen.getByLabelText(/pin \(min 4 digits\)/i), '1234');
      await user.type(screen.getByLabelText(/confirm pin/i), '9999');
      expect(screen.getByRole('alert')).toHaveTextContent(/pins do not match/i);
    });

    it('calls onSetPin with entered PIN on submit', async () => {
      const user = userEvent.setup();
      const { onSetPin } = renderModal();
      await user.type(screen.getByLabelText(/pin \(min 4 digits\)/i), '5678');
      await user.type(screen.getByLabelText(/confirm pin/i), '5678');
      await user.click(screen.getByRole('button', { name: /set pin/i }));
      await waitFor(() => expect(onSetPin).toHaveBeenCalledWith('5678'));
    });
  });

  describe('passphrase mode', () => {
    it('switches to passphrase tab and shows passphrase field', async () => {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole('tab', { name: /use a passphrase/i }));
      expect(screen.getByLabelText(/passphrase \(min 6 characters\)/i)).toBeInTheDocument();
    });

    it('resets value when switching tabs', async () => {
      const user = userEvent.setup();
      renderModal();
      await user.type(screen.getByLabelText(/pin \(min 4 digits\)/i), '1234');
      await user.click(screen.getByRole('tab', { name: /use a passphrase/i }));
      expect(screen.getByLabelText(/passphrase \(min 6 characters\)/i)).toHaveValue('');
    });

    it('enables submit when passphrase and confirm match and meet min length', async () => {
      const user = userEvent.setup();
      renderModal();
      await user.click(screen.getByRole('tab', { name: /use a passphrase/i }));
      await user.type(screen.getByLabelText(/passphrase \(min 6 characters\)/i), 'correct-horse');
      await user.type(screen.getByLabelText(/confirm passphrase/i), 'correct-horse');
      expect(screen.getByRole('button', { name: /set passphrase/i })).not.toBeDisabled();
    });

    it('calls onSetPin with passphrase on submit', async () => {
      const user = userEvent.setup();
      const { onSetPin } = renderModal();
      await user.click(screen.getByRole('tab', { name: /use a passphrase/i }));
      await user.type(screen.getByLabelText(/passphrase \(min 6 characters\)/i), 'hunter2secret');
      await user.type(screen.getByLabelText(/confirm passphrase/i), 'hunter2secret');
      await user.click(screen.getByRole('button', { name: /set passphrase/i }));
      await waitFor(() => expect(onSetPin).toHaveBeenCalledWith('hunter2secret'));
    });
  });

  describe('skip', () => {
    it('calls onSkip when Skip button clicked', async () => {
      const user = userEvent.setup();
      const { onSkip } = renderModal();
      await user.click(screen.getByRole('button', { name: /skip for now/i }));
      expect(onSkip).toHaveBeenCalledOnce();
    });

    it('does not show skip button when onSkip is not provided', () => {
      renderModal({ onSkip: undefined });
      expect(screen.queryByRole('button', { name: /skip for now/i })).not.toBeInTheDocument();
    });
  });
});
