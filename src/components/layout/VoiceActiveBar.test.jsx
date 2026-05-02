import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import VoiceActiveBar from './VoiceActiveBar';

describe('VoiceActiveBar', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the voice channel name and return prompt', () => {
    const channel = { id: 'vc1', name: 'standup', _displayName: 'Standup' };
    render(<VoiceActiveBar activeVoiceChannel={channel} onClick={vi.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent(/in voice: standup - tap to return/i);
  });

  it('falls back to _displayName when available', () => {
    const channel = { id: 'vc2', name: 'general', _displayName: 'Daily Standup' };
    render(<VoiceActiveBar activeVoiceChannel={channel} onClick={vi.fn()} />);

    expect(screen.getByRole('button')).toHaveTextContent(/in voice: daily standup - tap to return/i);
  });

  it('calls onClick when tapped', () => {
    const onClick = vi.fn();
    const channel = { id: 'vc1', name: 'standup' };
    render(<VoiceActiveBar activeVoiceChannel={channel} onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('keeps the legacy voice-active-bar CSS class', () => {
    const channel = { id: 'vc1', name: 'standup' };
    const { container } = render(<VoiceActiveBar activeVoiceChannel={channel} onClick={vi.fn()} />);

    expect(container.querySelector('.voice-active-bar')).toBeInTheDocument();
  });
});
