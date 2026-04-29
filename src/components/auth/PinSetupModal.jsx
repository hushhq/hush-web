import { useState, useCallback } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';

function strengthClass(level) {
  return level < 2 ? 'weak' : level < 3 ? 'fair' : 'strong';
}

/**
 * Computes a simple passphrase strength level (0-4).
 * @param {string} value
 * @returns {number}
 */
function passphraseStrength(value) {
  if (value.length < 6) return 0;
  if (value.length < 9) return 1;
  if (value.length < 12) return 2;
  if (value.length < 16) return 3;
  return 4;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

/**
 * First-time PIN or passphrase setup modal.
 *
 * @param {{
 *   onSetPin: (pin: string) => Promise<void>,
 *   onSkip?: () => void,
 *   isLoading?: boolean,
 * }} props
 */
export function PinSetupModal({ onSetPin, onSkip, isLoading = false }) {
  const [mode, setMode] = useState('pin'); // 'pin' | 'passphrase'
  const [value, setValue] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const isPin = mode === 'pin';
  const minLength = isPin ? 4 : 6;
  const strength = !isPin ? passphraseStrength(value) : null;
  const valueOk = value.length >= minLength;
  const confirmOk = value === confirm && valueOk;
  const mismatch = confirm.length > 0 && value !== confirm;

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setValue('');
    setConfirm('');
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!confirmOk) return;
    setError('');
    try {
      await onSetPin(value);
    } catch (err) {
      setError(err?.message || 'Failed to set PIN. Please try again.');
    }
  }, [confirmOk, onSetPin, value]);

  return (
    <Flex direction="column" gap="5" className="pin-setup-container">
      <Text size="2" color="gray" className="pin-setup-description">
        Your {isPin ? 'PIN' : 'passphrase'} encrypts your identity key on this device.
        You will need it to unlock Hush after closing your browser.
      </Text>

      <Tabs value={mode} onValueChange={switchMode}>
        <TabsList>
          <TabsTrigger value="pin">Use a PIN</TabsTrigger>
          <TabsTrigger value="passphrase">Use a passphrase</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="pin-setup-form">
          <TabsContent value="pin" className="psm-tab-content">
            <label htmlFor="psm-pin-value" className="pin-setup-field-label">
              PIN (min 4 digits)
            </label>
            <input
              id="psm-pin-value"
              className="input"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a PIN"
              minLength={4}
              inputMode="numeric"
              autoComplete="new-password"
            />
          </TabsContent>

          <TabsContent value="passphrase" className="psm-tab-content">
            <label htmlFor="psm-phrase-value" className="pin-setup-field-label">
              Passphrase (min 6 characters)
            </label>
            <input
              id="psm-phrase-value"
              className="input"
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a passphrase"
              minLength={6}
              autoComplete="new-password"
            />
            {value.length >= 2 && (
              <>
                <div className="pin-setup-strength-bar">
                  <div
                    className={`psm-strength-fill psm-strength-fill--${strengthClass(strength)}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
                {strength > 0 && (
                  <div className={`psm-strength-label psm-strength-label--${strengthClass(strength)}`}>
                    {STRENGTH_LABELS[strength]}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <div>
            <label htmlFor="pin-setup-confirm" className="pin-setup-field-label">
              Confirm {isPin ? 'PIN' : 'passphrase'}
            </label>
            <input
              id="pin-setup-confirm"
              className="input"
              type="password"
              inputMode={isPin ? 'numeric' : undefined}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={`Repeat your ${isPin ? 'PIN' : 'passphrase'}`}
              minLength={minLength}
              autoComplete="new-password"
            />
            {mismatch && (
              <Text as="p" role="alert" color="red" size="1" className="pin-setup-mismatch">
                {isPin ? 'PINs do not match' : 'Passphrases do not match'}
              </Text>
            )}
          </div>

          {error && (
            <Text as="p" role="alert" color="red" size="2" className="pin-setup-error">
              {error}
            </Text>
          )}

          <div className="pin-setup-actions">
            {onSkip && (
              <button
                type="button"
                className="back-link"
                onClick={onSkip}
              >
                Skip for now
              </button>
            )}
            <Button
              variant="default"
              type="submit"
              disabled={!confirmOk || isLoading}
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <CheckIcon data-icon="inline-start" />
                  {` Set ${isPin ? 'PIN' : 'passphrase'}`}
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>

      {onSkip && (
        <Text as="p" size="1" color="gray" className="pin-setup-skip-warning">
          Without a PIN, you will need your 12-word recovery phrase every time you open Hush.
        </Text>
      )}
    </Flex>
  );
}
