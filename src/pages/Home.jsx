import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Flex, Text, Heading } from '@radix-ui/themes';
import { EnterIcon, Link1Icon } from '@radix-ui/react-icons';
import { APP_VERSION } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { getHandshake } from '../lib/api';
import { AuthInstanceSelector } from '../components/auth/AuthInstanceSelector.jsx';
import { RegistrationWizard, hasInterruptedRegistration } from '../components/auth/RegistrationWizard';
import { RecoveryPhraseInput } from '../components/auth/RecoveryPhraseInput';
import { PinUnlockScreen } from '../components/auth/PinUnlockScreen';
import { PinSetupModal } from '../components/auth/PinSetupModal';
import { BODY_SCROLL_MODE, useBodyScrollMode } from '../hooks/useBodyScrollMode';
import { useAuthInstanceSelection } from '../hooks/useAuthInstanceSelection.js';
import { Button as ShadcnButton } from '../components/ui/button';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { HushLogo } from '../components/brand/HushLogo';

const HOME_PAGE_SCROLL_STYLE = {
  height: '100%',
  minHeight: '100dvh',
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
};

/**
 * Auth UI view states. Drives what is shown in the glass card.
 */
const AUTH_VIEW = {
  CHOOSE: 'choose',
  RECOVERY: 'recovery',
  REGISTER_WIZARD: 'register_wizard',
  PIN_UNLOCK: 'pin_unlock',
  PIN_SETUP: 'pin_setup',
};

function getAuthHeading(view) {
  if (view === AUTH_VIEW.REGISTER_WIZARD) return 'Welcome to Hush';
  return 'Log in to Hush';
}

function getInstanceLabel(instanceUrl) {
  try {
    return new URL(instanceUrl).host;
  } catch {
    return String(instanceUrl || 'this instance');
  }
}

function getInstanceUnreachableMessage(instanceUrl) {
  return `Could not reach ${getInstanceLabel(instanceUrl)}. Check the instance URL and that the server is online.`;
}

function isReachabilityError(err) {
  const msg = err?.message || String(err);
  return /could not reach|load failed|failed to fetch|networkerror/i.test(msg);
}

/** Maps raw auth/join errors to short, user-facing messages. */
function getFriendlyError(err, instanceUrl = '') {
  if (!err) return '';
  const msg = err?.message || String(err);
  if (isReachabilityError(err)) {
    return getInstanceUnreachableMessage(instanceUrl);
  }
  if (/session not found|session.*expired/i.test(msg)) {
    return 'Your session has ended. Please sign in again to continue.';
  }
  if (/not found|404/i.test(msg)) return 'Not found. Please try again.';
  if (/forbidden|403/i.test(msg)) return 'Access denied.';
  if (/conflict|409|already/i.test(msg)) return 'Username already taken. Please choose another.';
  if (/unauthorized|401/i.test(msg)) return 'Invalid credentials.';
  if (/no account found|key not found|unknown key/i.test(msg)) {
    return 'No account found for this recovery phrase. If you have lost all your devices, you will need to create a new account.';
  }
  return msg || 'Something went wrong. Please try again.';
}

export default function Home() {
  useBodyScrollMode(BODY_SCROLL_MODE.SCROLL);

  const {
    vaultState,
    user,
    performRegister,
    performRecovery,
    unlockVault,
    setPIN,
    hasVault,
    hasSession,
    needsUnlock,
    loading: authLoading,
    error: authError,
    clearError,
    needsPinSetup,
    skipPinSetup,
  } = useAuth();
  const [authView, setAuthView] = useState(AUTH_VIEW.CHOOSE);
  const [isPinSetupLoading, setIsPinSetupLoading] = useState(false);
  const [isRegistrationInstanceLocked, setIsRegistrationInstanceLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const {
    selectedInstanceUrl,
    selectedInstanceLabel,
    knownInstances,
    chooseInstance,
    rememberSelectedInstance,
  } = useAuthInstanceSelection();

  // Handshake data for the selected auth instance.
  const [handshakeData, setHandshakeData] = useState(null);
  const [handshakeError, setHandshakeError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setHandshakeData(null);
    setHandshakeError(null);

    getHandshake(selectedInstanceUrl)
      .then((data) => {
        if (cancelled) return;
        setHandshakeData(data);
        setHandshakeError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setHandshakeData(null);
        setHandshakeError(err);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedInstanceUrl]);

  useEffect(() => {
    if (authView !== AUTH_VIEW.REGISTER_WIZARD) {
      setIsRegistrationInstanceLocked(false);
    }
  }, [authView]);

  const registrationMode = handshakeData?.registration_mode ?? 'open';
  const instanceReachabilityMessage = handshakeError
    ? getInstanceUnreachableMessage(selectedInstanceUrl)
    : '';

  // ── Resume interrupted registration (iOS page discard recovery) ────────────
  useEffect(() => {
    if (authLoading || hasVault || hasSession) return;
    hasInterruptedRegistration().then((has) => {
      if (has) setAuthView(AUTH_VIEW.REGISTER_WIZARD);
    });
  }, [authLoading, hasSession, hasVault]);

  // ── Vault state -> authView sync ────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;

    if (needsPinSetup && hasSession) {
      setAuthView(AUTH_VIEW.PIN_SETUP);
      return;
    }

    if (needsUnlock) {
      setAuthView(AUTH_VIEW.PIN_UNLOCK);
      return;
    }

    if (!hasVault && !hasSession) {
      if (authView === AUTH_VIEW.PIN_UNLOCK || authView === AUTH_VIEW.PIN_SETUP) {
        setAuthView(AUTH_VIEW.CHOOSE);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, hasSession, hasVault, needsPinSetup, needsUnlock]);

  // ── Error toast ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const msg = authError ? getFriendlyError(authError, selectedInstanceUrl) : null;
    setToastMessage(msg);
    if (!msg) return;
    const id = setTimeout(() => {
      setToastMessage(null);
      clearError?.();
    }, 5000);
    return () => clearTimeout(id);
  }, [authError, clearError, selectedInstanceUrl]);

  // ── Auth action handlers ────────────────────────────────────────────────────

  const handleRegisterComplete = useCallback(async ({ username, displayName, mnemonic, inviteCode }) => {
    const instanceUrl = await rememberSelectedInstance(selectedInstanceUrl);
    await performRegister(username, displayName, mnemonic, inviteCode, instanceUrl);
  }, [performRegister, rememberSelectedInstance, selectedInstanceUrl]);

  const handleRecoverySubmit = useCallback(async (mnemonic, revokeOtherDevices) => {
    const instanceUrl = await rememberSelectedInstance(selectedInstanceUrl);
    await performRecovery(mnemonic, revokeOtherDevices, instanceUrl);
  }, [performRecovery, rememberSelectedInstance, selectedInstanceUrl]);

  const handlePinUnlock = useCallback(async (pin) => {
    await unlockVault(pin);
  }, [unlockVault]);

  const handleSwitchAccount = useCallback(() => {
    setAuthView(AUTH_VIEW.RECOVERY);
  }, []);

  const handlePinSetup = useCallback(async (pin) => {
    setIsPinSetupLoading(true);
    try {
      await setPIN(pin);
    } catch (err) {
      throw err;
    } finally {
      setIsPinSetupLoading(false);
    }
  }, [setPIN]);

  const handlePinSetupSkip = useCallback(() => {
    skipPinSetup();
  }, [skipPinSetup]);

  // ── View content ─────────────────────────────────────────────────────────────

  const renderFormContent = () => {
    if (authLoading) {
      return (
        <div className="home-loading">
          Loading...
        </div>
      );
    }

    if (authView === AUTH_VIEW.PIN_UNLOCK) {
      return (
        <PinUnlockScreen
          username={user?.username || user?.display_name || 'Your account'}
          avatarUrl={null}
          onUnlock={handlePinUnlock}
          onSwitchAccount={handleSwitchAccount}
        />
      );
    }

    if (authView === AUTH_VIEW.PIN_SETUP) {
      return (
        <PinSetupModal
          onSetPin={handlePinSetup}
          onSkip={handlePinSetupSkip}
          isLoading={isPinSetupLoading}
        />
      );
    }

    if (authView === AUTH_VIEW.REGISTER_WIZARD) {
      return (
        <RegistrationWizard
          onComplete={handleRegisterComplete}
          onCancel={() => {
            setIsRegistrationInstanceLocked(false);
            setAuthView(AUTH_VIEW.CHOOSE);
            clearError?.();
          }}
          registrationMode={registrationMode}
          instanceUrl={selectedInstanceUrl}
          instanceName={selectedInstanceLabel}
          onInstanceLockedChange={setIsRegistrationInstanceLocked}
          isLoading={authLoading}
          error={authError}
        />
      );
    }

    if (authView === AUTH_VIEW.RECOVERY) {
      return (
        <RecoveryPhraseInput
          onSubmit={handleRecoverySubmit}
          onCancel={() => {
            clearError?.();
            setAuthView(needsUnlock ? AUTH_VIEW.PIN_UNLOCK : AUTH_VIEW.CHOOSE);
          }}
          isRecoveryMode={true}
          isLoading={authLoading}
        />
      );
    }

    // Default: CHOOSE view
    return (
      <Flex direction="column" gap="5" className="home-auth-choose">
        <Flex direction="column" gap="3">
          <ShadcnButton
            size="lg"
            className="home-auth-btn h-auto"
            onClick={() => setAuthView(AUTH_VIEW.RECOVERY)}
          >
            <EnterIcon />
            Sign in
          </ShadcnButton>
          <ShadcnButton
            variant="secondary"
            size="lg"
            className="home-auth-btn h-auto"
            asChild
          >
            <Link to="/link-device?mode=new">
              <Link1Icon />
              Link to existing device
            </Link>
          </ShadcnButton>
        </Flex>

        {registrationMode !== 'closed' && (
          <Text align="center" size="2" color="gray" className="home-auth-signup-prompt">
            Don't have an account?{' '}
            <button
              type="button"
              className="home-auth-signup-link"
              onClick={() => setAuthView(AUTH_VIEW.REGISTER_WIZARD)}
            >
              Sign up
            </button>
          </Text>
        )}
      </Flex>
    );
  };

  return (
    <div className="home-page" style={HOME_PAGE_SCROLL_STYLE}>
      <div className="home-container">
        <div className="home-auth-header">
          <HushLogo className="home-auth-logo" />
          <Heading as="h1" size="6" className="home-auth-heading">
            {getAuthHeading(authView)}
          </Heading>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Card className="glass home-form-card gap-0 py-0 ring-0">
            <CardContent className="px-0">
              {renderFormContent()}

              {authView !== AUTH_VIEW.PIN_SETUP && !needsUnlock && (
                <>
                  <AuthInstanceSelector
                    value={selectedInstanceUrl}
                    instances={knownInstances}
                    onSelect={chooseInstance}
                    disabled={authLoading || (authView === AUTH_VIEW.REGISTER_WIZARD && isRegistrationInstanceLocked)}
                    compact
                  />
                  {handshakeError && (
                    <Alert variant="destructive" className="home-instance-error">
                      <AlertDescription>{instanceReachabilityMessage}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>

            <CardFooter className="home-footer px-0 rounded-none">
              <Text align="center" size="1" color="gray" className="home-footer-text">
                Hush is open source and self-hostable.{` `}
                <a href="https://github.com/hushhq" className="home-footer-link">
                  github
                </a>
                {' · '}
                <Link to="/roadmap" className="home-footer-link">
                  roadmap
                </Link>
              </Text>
              <Text align="center" size="1" color="gray" className="home-footer-meta">
                v{APP_VERSION}
              </Text>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="toast"
            className="home-error-toast"
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
