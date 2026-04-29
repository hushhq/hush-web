import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Empty, EmptyDescription } from '@/components/ui/empty.tsx';

function DeviceOption({ label, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`dpm-option${isSelected ? ' dpm-option--selected' : ''}`}
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <div className="dpm-option-label">{label || 'Unknown device'}</div>
      {isSelected && <div className="dpm-selected-dot" aria-hidden="true" />}
    </button>
  );
}

export default function DevicePickerModal({
  title,
  devices,
  selectedDeviceId,
  onSelect,
  onCancel,
}) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose(); }}>
      <DialogContent
        className="modal-content dpm-content"
        showCloseButton={false}
      >
        <DialogTitle className="dpm-title">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Choose an input device from the list below.
        </DialogDescription>

        <div className="dpm-list">
          {devices.length === 0 ? (
            <Empty className="dpm-empty">
              <EmptyDescription className="dpm-empty-text">
                no devices found
              </EmptyDescription>
            </Empty>
          ) : (
            devices.map((device) => (
              <DeviceOption
                key={device.deviceId}
                label={device.label}
                isSelected={device.deviceId === selectedDeviceId}
                onSelect={() => onSelect(device.deviceId)}
              />
            ))
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          className="dpm-cancel-btn"
          onClick={handleClose}
        >
          cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
