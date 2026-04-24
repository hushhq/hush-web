import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import TransparencyBlock from './TransparencyBlock';

describe('TransparencyBlock', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders the warning icon, heading, error text, note, and sign-out button', () => {
    render(<TransparencyBlock error="Key mismatch detected." onSignOut={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /key verification failed/i })).toBeInTheDocument();
    expect(screen.getByText('Key mismatch detected.')).toBeInTheDocument();
    expect(screen.getByText(/account may be compromised/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('calls onSignOut when the sign-out button is clicked', () => {
    const onSignOut = vi.fn();
    render(<TransparencyBlock error="Bad key." onSignOut={onSignOut} />);

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });
});
