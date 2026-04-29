import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthInstanceSelector } from './AuthInstanceSelector.jsx';
import { DEFAULT_AUTH_INSTANCE_URL } from '../../lib/authInstanceStore.js';

const INSTANCES = [
  { url: DEFAULT_AUTH_INSTANCE_URL, lastUsedAt: null },
  { url: 'https://hush.example.com', lastUsedAt: '2026-04-01T12:00:00.000Z' },
];

function renderSelector(overrides = {}) {
  const props = {
    value: DEFAULT_AUTH_INSTANCE_URL,
    instances: INSTANCES,
    onSelect: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };

  render(<AuthInstanceSelector {...props} />);
  return props;
}

describe('AuthInstanceSelector', () => {
  afterEach(cleanup);

  it('opens a popover with saved instances and the custom instance form', async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole('button', { name: /connection instance:/i }));

    expect(screen.getByText('Switch instance')).toBeInTheDocument();
    expect(screen.getByText('Pinned default')).toBeInTheDocument();
    expect(screen.getByText(/last used/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add custom instance/i)).toBeInTheDocument();
  });

  it('selects a saved instance and closes the popover', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderSelector();

    await user.click(screen.getByRole('button', { name: /connection instance:/i }));
    await user.click(screen.getByRole('button', { name: /hush.example.com/i }));

    expect(onSelect).toHaveBeenCalledWith('https://hush.example.com');
    await waitFor(() => {
      expect(screen.queryByText('Switch instance')).not.toBeInTheDocument();
    });
  });

  it('submits a custom instance URL', async () => {
    const user = userEvent.setup();
    const { onSelect } = renderSelector();

    await user.click(screen.getByRole('button', { name: /connection instance:/i }));
    await user.type(screen.getByPlaceholderText(/add custom instance/i), 'https://custom.example.com');
    await user.click(screen.getByRole('button', { name: /add custom instance/i }));

    expect(onSelect).toHaveBeenCalledWith('https://custom.example.com');
  });

  it('shows validation errors from the selection handler', async () => {
    const user = userEvent.setup();
    renderSelector({
      onSelect: vi.fn().mockRejectedValue(new Error('Invalid instance URL.')),
    });

    await user.click(screen.getByRole('button', { name: /connection instance:/i }));
    await user.type(screen.getByPlaceholderText(/add custom instance/i), 'bad-url');
    await user.click(screen.getByRole('button', { name: /add custom instance/i }));

    expect(await screen.findByText('Invalid instance URL.')).toBeInTheDocument();
  });
});
