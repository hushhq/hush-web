import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'hush_post_recovery_wizard';

/**
 * Post-recovery wizard overlay.
 *
 * Rendered in the authenticated route tree (App.jsx) as a sibling to Routes,
 * so it overlays any page the user lands on after boot completes. It checks
 * localStorage on mount; if the flag is present it shows once, then clears
 * the flag immediately so it never reappears.
 *
 * The wizard offers two actions:
 *   - "Link a Device"  → navigates to /link-device?mode=new
 *   - "Skip"           → dismisses the overlay
 */
export function PostRecoveryWizard() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const flagPresent = localStorage.getItem(STORAGE_KEY) === '1';
    if (flagPresent) {
      // Remove the flag immediately -- wizard is shown at most once regardless
      // of how the user dismisses it (skip, link, or hard-refresh mid-session).
      localStorage.removeItem(STORAGE_KEY);
      setShow(true);
    }
  }, []);

  const handleLinkDevice = () => {
    setShow(false);
    navigate('/link-device?mode=new');
  };

  const handleSkip = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="post-recovery-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-recovery-heading"
    >
      <div className="post-recovery-card">
        <h2 id="post-recovery-heading" className="post-recovery-heading">
          Account Secured
        </h2>
        <p className="post-recovery-body">
          Your account has been recovered. Would you like to link another device?
        </p>
        <div className="post-recovery-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLinkDevice}
            style={{ flex: 1, padding: '10px' }}
          >
            Link a Device
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSkip}
            style={{ flex: 1, padding: '10px' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
