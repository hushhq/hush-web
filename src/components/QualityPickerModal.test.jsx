import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import QualityPickerModal from './QualityPickerModal';
import { QUALITY_PRESETS } from '../utils/constants';

describe('QualityPickerModal', () => {
  beforeEach(() => { cleanup(); });
  afterEach(() => { cleanup(); });

  it('renders the title and every preset', () => {
    render(
      <QualityPickerModal
        recommendedQualityKey={null}
        recommendedUploadMbps={null}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('choose stream quality')).toBeInTheDocument();
    for (const preset of Object.values(QUALITY_PRESETS)) {
      expect(screen.getByText(preset.label)).toBeInTheDocument();
      expect(screen.getByText(preset.description)).toBeInTheDocument();
    }
  });

  it('calls onSelect with the preset key when a row is clicked', () => {
    const onSelect = vi.fn();
    render(
      <QualityPickerModal
        recommendedQualityKey={null}
        recommendedUploadMbps={null}
        onSelect={onSelect}
        onCancel={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText(QUALITY_PRESETS.lite.label));
    expect(onSelect).toHaveBeenCalledWith('lite');
  });

  it('renders the recommended hint for the recommended preset', () => {
    render(
      <QualityPickerModal
        recommendedQualityKey="source"
        recommendedUploadMbps={42}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('(Recommended: 42 Mbps)')).toBeInTheDocument();
  });

  it('renders localhost recommended hint for very high uploads', () => {
    render(
      <QualityPickerModal
        recommendedQualityKey="source"
        recommendedUploadMbps={250}
        onSelect={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('(Recommended: localhost)')).toBeInTheDocument();
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <QualityPickerModal
        recommendedQualityKey={null}
        recommendedUploadMbps={null}
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
      <QualityPickerModal
        recommendedQualityKey={null}
        recommendedUploadMbps={null}
        onSelect={vi.fn()}
        onCancel={onCancel}
      />,
    );

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
