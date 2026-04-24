import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ServerShell from './ServerShell';

describe('ServerShell', () => {
  beforeEach(() => {
    cleanup();
  });

  it('renders TransparencyBlock when transparencyError is present', () => {
    render(
      <ServerShell
        transparencyError="Key mismatch."
        onTransparencySignOut={vi.fn()}
        serverId="s1"
      />,
    );

    expect(screen.getByRole('heading', { name: /key verification failed/i })).toBeInTheDocument();
  });

  it('renders empty-state shell when no serverId is provided', () => {
    render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
        serverId={null}
        serverListEl={<div data-testid="server-list" />}
        emptyStateEl={<div data-testid="empty-state" />}
        guildCreateModal={null}
        hasNoTransparencyLog={false}
        authToken="token"
        toastEl={<div data-testid="toast" />}
      />,
    );

    expect(screen.getByTestId('server-list')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders desktop layout when not on mobile and a server is active', () => {
    render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
        serverId="s1"
        isMobile={false}
        sidebarWidth={240}
        onSidebarResize={vi.fn()}
        serverListEl={<div data-testid="server-list" />}
        channelSidebarEl={<div data-testid="channel-sidebar" />}
        hasNoTransparencyLog={false}
        authToken="token"
        toastEl={<div data-testid="toast" />}
      >
        <div data-testid="channel-content" />
      </ServerShell>,
    );

    expect(screen.getByTestId('server-list')).toBeInTheDocument();
    expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('channel-content')).toBeInTheDocument();
    expect(screen.getByRole('separator', { name: /resize channel list/i })).toBeInTheDocument();
  });

  it('renders mobile layout when on mobile and a server is active', () => {
    render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
        serverId="s1"
        isMobile={true}
        mobileStack={1}
        activeVoiceChannel={null}
        isViewingVoice={false}
        serverListEl={<div data-testid="server-list" />}
        channelSidebarEl={<div data-testid="channel-sidebar" />}
        hasNoTransparencyLog={false}
        authToken="token"
        toastEl={<div data-testid="toast" />}
      >
        <div data-testid="channel-content" />
      </ServerShell>,
    );

    expect(screen.getByTestId('server-list')).toBeInTheDocument();
    expect(screen.getByTestId('channel-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('channel-content')).toBeInTheDocument();
  });

  it('shows offline banner when the instance is offline', () => {
    render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
        serverId="s1"
        isInstanceOffline={true}
        instanceUrl="https://a.example.com"
        isMobile={false}
        sidebarWidth={240}
        onSidebarResize={vi.fn()}
        serverListEl={<div data-testid="server-list" />}
        channelSidebarEl={<div data-testid="channel-sidebar" />}
        hasNoTransparencyLog={false}
        authToken="token"
        toastEl={null}
      >
        <div />
      </ServerShell>,
    );

    expect(screen.getByText(/a.example.com is offline/i)).toBeInTheDocument();
  });

  it('shows transparency no-log badge when configured and authenticated', () => {
    render(
      <ServerShell
        transparencyError={null}
        onTransparencySignOut={vi.fn()}
        serverId="s1"
        isMobile={false}
        sidebarWidth={240}
        onSidebarResize={vi.fn()}
        serverListEl={<div data-testid="server-list" />}
        channelSidebarEl={<div data-testid="channel-sidebar" />}
        hasNoTransparencyLog={true}
        authToken="token"
        toastEl={null}
      >
        <div />
      </ServerShell>,
    );

    expect(screen.getByLabelText(/transparency log not configured/i)).toBeInTheDocument();
  });
});
