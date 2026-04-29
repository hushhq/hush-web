import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DevicePickerModal from './DevicePickerModal';

const sampleDevices = [
  { deviceId: 'dev-1', label: 'Built-in Microphone' },
  { deviceId: 'dev-2', label: 'External USB Mic' },
  { deviceId: 'dev-3', label: '' },
];

describe('DevicePickerModal', () => {
  beforeEach(() => { cleanup(); });
  afterEach(() => { cleanup(); });

  it('renders the dialog title and device labels', () => {
    render(
      <DevicePickerModal
        title="Choose microphone"
        devices={sampleDevices}
        selectedDeviceId="dev-1"
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('Choose microphone')).toBeInTheDocument();
    expect(screen.getByText('Built-in Microphone')).toBeInTheDocument();
    expect(screen.getByText('External USB Mic')).toBeInTheDocument();
    expect(screen.getByText('Unknown device')).toBeInTheDocument();
  });

  it('marks the selected device with aria-pressed', () => {
    render(
      <DevicePickerModal
        title="Pick"
        devices={sampleDevices}
        selectedDeviceId="dev-2"
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    const selected = screen.getByText('External USB Mic').closest('button');
    expect(selected).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onSelect with the device id when a row is clicked', () => {
    const onSelect = vi.fn();
    render(
      <DevicePickerModal
        title="Pick"
        devices={sampleDevices}
        selectedDeviceId="dev-1"
        onSelect={onSelect}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText('External USB Mic'));
    expect(onSelect).toHaveBeenCalledWith('dev-2');
  });

  it('shows the empty state when there are no devices', () => {
    render(
      <DevicePickerModal
        title="Pick"
        devices={[]}
        selectedDeviceId={null}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('no devices found')).toBeInTheDocument();
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <DevicePickerModal
        title="Pick"
        devices={sampleDevices}
        selectedDeviceId="dev-1"
        onSelect={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Escape is pressed', () => {
    const onCancel = vi.fn();
    render(
      <DevicePickerModal
        title="Pick"
        devices={sampleDevices}
        selectedDeviceId="dev-1"
        onSelect={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
