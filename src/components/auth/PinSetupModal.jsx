import { useState, useCallback } from 'react';
import { Button } from '../ui';

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
    <div className="pin-setup-container">
      <p className="pin-setup-description">
        Your {isPin ? 'PIN' : 'passphrase'} encrypts your identity key on this device.
        You will need it to unlock Hush after closing your browser.
      </p>

      <div className="pin-setup-mode-toggle">
        <button
          type="button"
          className={`psm-mode-btn${isPin ? ' psm-mode-btn--active' : ''}`}
          onClick={() => switchMode('pin')}
        >
          Use a PIN
        </button>
        <button
          type="button"
          className={`psm-mode-btn${!isPin ? ' psm-mode-btn--active' : ''}`}
          onClick={() => switchMode('passphrase')}
        >
          Use a passphrase
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pin-setup-form">
        <div>
          <label htmlFor="pin-setup-value" className="pin-setup-field-label">
            {isPin ? 'PIN (min 4 digits)' : 'Passphrase (min 6 characters)'}
          </label>
          <input
            id="pin-setup-value"
            className="input"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={isPin ? 'Enter a PIN' : 'Enter a passphrase'}
            minLength={minLength}
            inputMode={isPin ? 'numeric' : undefined}
            autoComplete="new-password"
          />
          {!isPin && value.length >= 2 && (
            <>
              <div className="pin-setup-strength-bar">
                <div className={`psm-strength-fill psm-strength-fill--${strengthClass(strength)}`} style={{ width: `${(strength / 4) * 100}%` }} />
              </div>
              {strength > 0 && (
                <div className={`psm-strength-label psm-strength-label--${strengthClass(strength)}`}>
                  {STRENGTH_LABELS[strength]}
                </div>
              )}
            </>
          )}
        </div>

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
            <div className="pin-setup-mismatch" role="alert">
              {isPin ? 'PINs do not match' : 'Passphrases do not match'}
            </div>
          )}
        </div>

        {error && (
          <div className="pin-setup-error" role="alert">
            {error}
          </div>
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
            variant="primary"
            type="submit"
            disabled={!confirmOk || isLoading}
          >
            {isLoading ? 'Saving...' : `Set ${isPin ? 'PIN' : 'passphrase'}`}
          </Button>
        </div>
      </form>

      {onSkip && (
        <div className="pin-setup-skip-warning">
          Without a PIN, you will need your 12-word recovery phrase every time you open Hush.
        </div>
      )}
    </div>
  );
}
