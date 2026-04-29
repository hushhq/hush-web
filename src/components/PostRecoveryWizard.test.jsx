/**
 * PostRecoveryWizard.test.jsx
 *
 * Covers:
 *   - Wizard does not render when localStorage flag is absent
 *   - Wizard renders when localStorage flag is present
 *   - localStorage flag is removed immediately on mount (not on dismiss)
 *   - "Skip" dismisses the wizard without navigating
 *   - "Link a Device" dismisses the wizard and navigates to /link-device
 *   - Wizard does not reappear after it has been dismissed (flag is already gone)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PostRecoveryWizard } from './PostRecoveryWizard.jsx';

const STORAGE_KEY = 'hush_post_recovery_wizard';

// Capture navigate calls from useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWizard() {
  return render(
    <MemoryRouter>
      <PostRecoveryWizard />
    </MemoryRouter>,
  );
}

describe('PostRecoveryWizard', () => {
  beforeEach(() => {
    cleanup();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('renders nothing when the localStorage flag is absent', () => {
    const { container } = renderWizard();
    expect(container.firstChild).toBeNull();
  });

  it('renders the overlay when the localStorage flag is set to "1"', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    renderWizard();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Account Secured')).toBeInTheDocument();
    expect(screen.getByText(/if you want to add another device now/i)).toBeInTheDocument();
  });

  it('removes the localStorage flag immediately on mount before any user action', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    renderWizard();
    // Flag must be gone as soon as the component mounts — not waiting for dismiss
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('hides the overlay when Skip is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, '1');
    renderWizard();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /skip/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to /link-device and hides overlay when "Link a Device" is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(STORAGE_KEY, '1');
    renderWizard();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /link a device/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/link-device');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not reappear on a second render because the flag is already gone', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    const { unmount } = renderWizard();
    // Flag is gone after first mount
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    unmount();

    // Re-render simulates a hard-refresh — flag is gone, nothing shown
    const { container } = renderWizard();
    expect(container.firstChild).toBeNull();
  });

  it('has accessible dialog role and labelled heading', () => {
    localStorage.setItem(STORAGE_KEY, '1');
    renderWizard();
    // Radix Dialog binds aria-labelledby to its DialogTitle automatically.
    const dialog = screen.getByRole('dialog', { name: 'Account Secured' });
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('heading', { name: 'Account Secured' })).toBeInTheDocument();
  });
});
