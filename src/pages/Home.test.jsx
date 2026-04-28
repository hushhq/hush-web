import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { useAuth } from '../contexts/AuthContext';
import { TooltipProvider } from '../components/ui';

const mockRegistrationWizardProps = vi.hoisted(() => ({ current: null }));

function makeAuthState(overrides = {}) {
  return {
    vaultState: 'none',
    user: null,
    performRegister: vi.fn(),
    performRecovery: vi.fn(),
    unlockVault: vi.fn(),
    setPIN: vi.fn(),
    isAuthenticated: false,
    hasVault: false,
    hasSession: false,
    isVaultUnlocked: false,
    needsUnlock: false,
    loading: false,
    error: null,
    clearError: vi.fn(),
    needsPinSetup: false,
    skipPinSetup: vi.fn(),
    ...overrides,
  };
}

vi.mock('../utils/constants', () => ({
  APP_VERSION: 'test-version',
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => makeAuthState()),
}));

vi.mock('../components/auth/RegistrationWizard', () => ({
  RegistrationWizard: function MockRegistrationWizard(props) {
    mockRegistrationWizardProps.current = props;
    return (
      <div>
        <div>Registration Wizard</div>
        <button type="button" onClick={() => props.onInstanceLockedChange?.(true)}>
          Lock Instance
        </button>
      </div>
    );
  },
  hasInterruptedRegistration: vi.fn().mockResolvedValue(false),
}));

vi.mock('../components/auth/RecoveryPhraseInput', () => ({
  RecoveryPhraseInput: function MockRecoveryPhraseInput(props) {
    return (
      <div>
        <div>Recovery Phrase Input</div>
        <button type="button" onClick={() => props.onCancel?.()}>
          Cancel Recovery
        </button>
      </div>
    );
  },
}));

vi.mock('../components/auth/PinUnlockScreen', () => ({
  PinUnlockScreen: function MockPinUnlockScreen(props) {
    return (
      <div>
        <div>PIN Unlock</div>
        <button type="button" onClick={() => props.onSwitchAccount?.()}>
          Switch Account
        </button>
      </div>
    );
  },
}));

vi.mock('../components/auth/PinSetupModal', () => ({
  PinSetupModal: function MockPinSetupModal() {
    return <div>PIN Setup</div>;
  },
}));

vi.mock('motion/react', () => {
  const passthrough = (Tag) => function MotionPassthrough({ children, ...props }) {
    return <Tag {...props}>{children}</Tag>;
  };

  return {
    motion: {
      div: passthrough('div'),
      span: passthrough('span'),
    },
    AnimatePresence: function AnimatePresence({ children }) {
      return <>{children}</>;
    },
  };
});

function renderHome() {
  return render(
    <MemoryRouter>
      <TooltipProvider>
        <Home />
      </TooltipProvider>
    </MemoryRouter>,
  );
}

describe('Home', () => {
  let originalFetch;
  let originalMatchMedia;
  let originalCreateRange;
  let originalResizeObserver;
  let originalFonts;

  beforeEach(() => {
    cleanup();
    mockRegistrationWizardProps.current = null;

    originalFetch = global.fetch;
    originalMatchMedia = window.matchMedia;
    originalCreateRange = document.createRange;
    originalResizeObserver = global.ResizeObserver;
    originalFonts = document.fonts;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ capabilities: {} }),
    });

    window.matchMedia = vi.fn((query) => ({
      matches: query === '(pointer: coarse)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    document.createRange = vi.fn(() => ({
      setStart: vi.fn(),
      setEnd: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({ left: 0, width: 12 })),
    }));

    global.ResizeObserver = class MockResizeObserver {
      observe() {}
      disconnect() {}
    };

    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
  });

  afterEach(() => {
    cleanup();
    // Restore the default useAuth factory so error-state tests don't bleed over.
    vi.mocked(useAuth).mockImplementation(() => makeAuthState());
    global.fetch = originalFetch;
    window.matchMedia = originalMatchMedia;
    document.createRange = originalCreateRange;
    global.ResizeObserver = originalResizeObserver;

    if (originalFonts === undefined) {
      // eslint-disable-next-line no-undefined
      delete document.fonts;
    } else {
      Object.defineProperty(document, 'fonts', {
        configurable: true,
        value: originalFonts,
      });
    }
  });

  it('keeps the sign-in auth shell scrollable on mobile', async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Recovery Phrase Input')).toBeInTheDocument();
    expect(container.querySelector('.home-page')).toHaveStyle({
      overflowY: 'auto',
      overflowX: 'hidden',
    });
    expect(document.body.dataset.hushScrollMode).toBe('scroll');
    expect(document.body.style.overflowY).toBe('auto');
  });

  it('keeps the registration flow scrollable on mobile', async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByText('Registration Wizard')).toBeInTheDocument();
    expect(container.querySelector('.home-page')).toHaveStyle({
      overflowY: 'auto',
      overflowX: 'hidden',
    });
    expect(document.body.dataset.hushScrollMode).toBe('scroll');
    expect(document.body.style.overflowY).toBe('auto');
  });

  it('locks the instance selector once registration advances past the username step', async () => {
    const user = userEvent.setup();
    renderHome();

    const instanceSelector = screen.getByRole('button', { name: /connection instance:/i });
    expect(instanceSelector).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Registration Wizard')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /lock instance/i }));
    expect(screen.getByRole('button', { name: /connection instance:/i })).toBeDisabled();
  });

  it('offers device linking from the unauthenticated home screen', () => {
    renderHome();

    const link = screen.getByRole('link', { name: /link to existing device/i });
    expect(link).toHaveAttribute('href', '/link-device?mode=new');
  });

  it('shows the Hush logo and sign-in heading on the unauthenticated home screen', () => {
    renderHome();
    expect(screen.getByRole('img', { name: /hush logo/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /log in to hush/i })).toBeInTheDocument();
  });

  it('shows "Welcome to Hush" heading when switching to registration', async () => {
    const user = userEvent.setup();
    renderHome();

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    expect(screen.getByRole('heading', { name: /welcome to hush/i })).toBeInTheDocument();
    expect(screen.getByText('Registration Wizard')).toBeInTheDocument();
  });

  it('renders the auth-card footer with capitalised "Hush" copy', () => {
    renderHome();
    const footer = document.querySelector('.home-footer');
    expect(footer).not.toBeNull();
    expect(footer.textContent).toMatch(/Hush is open source and self-hostable\./);
    // Ensure the lower-cased variant is gone.
    expect(footer.textContent).not.toMatch(/^hush is open source/);
  });

  it('renders the Sign up link without a default underline (no inline text-decoration)', () => {
    renderHome();
    const signup = screen.getByRole('button', { name: /sign up/i });
    // Class hook for the underline-on-hover styling lives on the button.
    expect(signup.classList.contains('home-auth-signup-link')).toBe(true);
    // The default class should NOT carry an inline `text-decoration: underline`
    // override; the hover/focus rule supplies it. (Class-based contract: the
    // computed style cannot be inspected reliably in jsdom, but the inline
    // style attribute should remain empty here.)
    expect(signup.getAttribute('style') || '').not.toMatch(/text-decoration:\s*underline/i);
  });

  it('hides the "Sign up" link when registration is closed', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ registration_mode: 'closed' }),
    });
    renderHome();

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
    });
  });

  it('shows PIN unlock for a known browser profile that needs unlock', () => {
    vi.mocked(useAuth).mockImplementation(() => makeAuthState({
      vaultState: 'locked',
      hasVault: true,
      needsUnlock: true,
    }));

    renderHome();

    expect(screen.getByText('PIN Unlock')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /connection instance:/i })).not.toBeInTheDocument();
  });

  it('returns to PIN unlock when recovery is cancelled on a locked known browser profile', async () => {
    const user = userEvent.setup();
    vi.mocked(useAuth).mockImplementation(() => makeAuthState({
      hasVault: true,
      needsUnlock: true,
    }));

    renderHome();

    await user.click(screen.getByRole('button', { name: /switch account/i }));
    expect(screen.getByText('Recovery Phrase Input')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cancel recovery/i }));
    expect(screen.getByText('PIN Unlock')).toBeInTheDocument();
  });

  // ── J.1-03: getFriendlyError session-not-found mapping ───────────────────

  it('shows "Your session has ended." when auth error message is "session not found"', async () => {
    vi.mocked(useAuth).mockImplementation(() => ({
      ...makeAuthState(),
      error: new Error('session not found or expired'),
    }));

    renderHome();

    await waitFor(() => {
      expect(screen.getByText(/your session has ended\. please sign in again/i)).toBeInTheDocument();
    });
  });

  it('shows "Invalid credentials." for a generic 401 error (session-not-found must NOT match)', async () => {
    vi.mocked(useAuth).mockImplementation(() => ({
      ...makeAuthState(),
      error: new Error('unauthorized'),
    }));

    renderHome();

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials\./i)).toBeInTheDocument();
    });
  });
});
