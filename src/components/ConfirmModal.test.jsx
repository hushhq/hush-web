import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmModal from './ConfirmModal';

function renderModal(overrides = {}) {
  const props = {
    title: 'Delete channel',
    message: 'This cannot be undone.',
    confirmLabel: 'Delete',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };
  render(<ConfirmModal {...props} />);
  return props;
}

describe('ConfirmModal', () => {
  afterEach(cleanup);

  it('renders title and message', () => {
    renderModal();
    expect(screen.getByText('Delete channel')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('uses custom confirmLabel', () => {
    renderModal({ confirmLabel: 'Remove' });
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('confirm click calls only onConfirm', async () => {
    const { onConfirm, onCancel } = renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancel click calls only onCancel', async () => {
    const { onConfirm, onCancel } = renderModal();
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('Escape key calls only onCancel', () => {
    const { onConfirm, onCancel } = renderModal();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('loading=true disables both buttons', () => {
    renderModal({ loading: true });
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('loading=true shows confirmLoadingLabel when provided', () => {
    renderModal({ loading: true, confirmLoadingLabel: 'Deleting...' });
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('loading=true blocks Escape key', () => {
    const { onCancel } = renderModal({ loading: true });
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('cancelLabel overrides the cancel button text', () => {
    renderModal({ cancelLabel: 'Stay signed in' });
    expect(screen.getByRole('button', { name: 'Stay signed in' })).toBeInTheDocument();
  });
});
