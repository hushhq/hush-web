import { useState } from 'react';
import { QUALITY_PRESETS } from '../utils/constants';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';

function OptionRow({ label, detail, recommendedLabel, onClick }) {
  return (
    <button
      type="button"
      className="qpm-option"
      onClick={onClick}
    >
      <div className="qpm-option-left">
        <div className="qpm-option-label">
          {label}
          {recommendedLabel != null && (
            <span className="qpm-option-label-hint">
              ({recommendedLabel})
            </span>
          )}
        </div>
        <div className="qpm-option-detail">{detail}</div>
      </div>
      <svg
        data-icon="inline-end"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--hush-text-muted)"
        strokeWidth="2"
        aria-hidden="true"
        focusable="false"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

function formatRecommended(recommendedQualityKey, recommendedUploadMbps) {
  if (recommendedQualityKey == null || recommendedUploadMbps == null) return null;
  const isLocalhost = recommendedUploadMbps >= 99;
  return isLocalhost
    ? 'Recommended: localhost'
    : `Recommended: ${recommendedUploadMbps.toFixed(0)} Mbps`;
}

export default function QualityPickerModal({
  recommendedQualityKey,
  recommendedUploadMbps,
  onSelect,
  onCancel,
}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  const recommendedLabel = formatRecommended(recommendedQualityKey, recommendedUploadMbps);

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
      <DialogContent
        className="modal-content qpm-content"
        showCloseButton={false}
      >
        <DialogTitle className="qpm-title">choose stream quality</DialogTitle>
        <DialogDescription className="sr-only">
          Pick a streaming quality preset for screen sharing.
        </DialogDescription>

        {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
          <OptionRow
            key={key}
            label={preset.label}
            detail={preset.description}
            recommendedLabel={recommendedQualityKey === key ? recommendedLabel : null}
            onClick={() => onSelect(key)}
          />
        ))}

        <Button
          type="button"
          variant="ghost"
          className="qpm-cancel-btn"
          onClick={handleClose}
        >
          cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
