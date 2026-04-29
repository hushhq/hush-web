import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';

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
 *   - "Link a Device"  → navigates to /link-device for the approval flow
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
    navigate('/link-device');
  };

  const handleSkip = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="post-recovery-card">
        <DialogHeader>
          <DialogTitle className="post-recovery-heading">
            Account Secured
          </DialogTitle>
          <DialogDescription className="post-recovery-body">
            Your account has been recovered. If you want to add another device now,
            open the approval flow on this trusted device.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="post-recovery-actions">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button variant="default" onClick={handleLinkDevice}>
            Link a Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
