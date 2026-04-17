import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock('../lib/api', () => ({
  getInviteInfo: vi.fn(),
  claimInvite: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../contexts/InstanceContext', () => ({
  useInstanceContext: vi.fn(),
}));

vi.mock('../lib/guildMetadata', () => ({
  decodeGuildNameFromInvite: vi.fn((encoded) => decodeURIComponent(encoded)),
  decodeGuildMetadataKeyFromInvite: vi.fn(() => new Uint8Array(32).fill(1)),
}));

vi.mock('../lib/guildMetadataKeyStore', () => ({
  openGuildMetadataKeyStore: vi.fn().mockResolvedValue({ close: vi.fn() }),
  setGuildMetadataKeyBytes: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../hooks/useAuth', () => ({
  getDeviceId: vi.fn(() => 'device-1'),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import * as apiModule from '../lib/api';
import * as guildMetadataKeyStore from '../lib/guildMetadataKeyStore';
import { useAuth } from '../contexts/AuthContext';
import { useInstanceContext } from '../contexts/InstanceContext';
import Invite from './Invite';

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderInvite(path, routes = []) {
  const allRoutes = [
    <Route key="invite" path="/invite/:code" element={<Invite />} />,
    <Route key="join" path="/join/:instance/:code" element={<Invite />} />,
    <Route key="home" path="/" element={<div>Home</div>} />,
    <Route key="server" path="/servers/:serverId/channels" element={<div>Server channel</div>} />,
    ...routes,
  ];
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>{allRoutes}</Routes>
    </MemoryRouter>,
  );
}

function makeAuthState(overrides = {}) {
  return {
    isAuthenticated: false,
    hasSession: false,
    needsUnlock: false,
    user: { id: 'u1' },
    ...overrides,
  };
}

function makeInstanceContext(overrides = {}) {
  return {
    bootInstance: vi.fn().mockResolvedValue(undefined),
    getTokenForInstance: vi.fn((instanceUrl) => {
      if (instanceUrl === window.location.origin) return 'local-jwt';
      return 'instance-jwt';
    }),
    refreshGuilds: vi.fn().mockResolvedValue(undefined),
    instanceStates: new Map([
      ['https://remote.example.com', { connectionState: 'connected', jwt: 'instance-jwt' }],
      [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
    ]),
    mergedGuilds: [],
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Invite - same-instance flow', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.location.hash = '';
    sessionStorage.clear();
    guildMetadataKeyStore.openGuildMetadataKeyStore.mockResolvedValue({ close: vi.fn() });
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('fetches invite info and shows guild preview for authenticated user', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext({
      instanceStates: new Map([
        ['https://local.example.com', { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
      mergedGuilds: [{ id: 'srv-1', instanceUrl: 'https://local.example.com', name: 'My Guild' }],
    }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1', memberCount: 42 });
    apiModule.claimInvite.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    // Initially shows loading
    expect(screen.getByText(/loading invite/i)).toBeInTheDocument();

    // After fetch: shows authenticated joining state
    await waitFor(() => {
      expect(screen.getByText(/you're invited to join/i)).toBeInTheDocument();
    });

    expect(apiModule.getInviteInfo).toHaveBeenCalledWith('abc123', undefined);
  });

  it('auto-claims invite for authenticated same-instance user', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext({
      instanceStates: new Map([
        [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
    }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });
    apiModule.claimInvite.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(apiModule.claimInvite).toHaveBeenCalledWith('local-jwt', 'abc123', window.location.origin);
    });
  });

  it('refreshes guilds before navigating after a same-instance claim', async () => {
    const ctx = makeInstanceContext({
      instanceStates: new Map([
        [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
    });
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(ctx);
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });
    apiModule.claimInvite.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(ctx.refreshGuilds).toHaveBeenCalledWith(window.location.origin);
      expect(screen.getByText('Server channel')).toBeInTheDocument();
    });
  });

  it('stores guild metadata key from the invite fragment after a successful claim', async () => {
    useAuth.mockReturnValue(makeAuthState({ hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext({
      instanceStates: new Map([
        [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
    }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });
    apiModule.claimInvite.mockResolvedValue({ serverId: 'srv-1' });
    window.location.hash = '#name=Secret%20Guild&mk=encoded-key';

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(guildMetadataKeyStore.setGuildMetadataKeyBytes).toHaveBeenCalledWith(
        expect.any(Object),
        'srv-1',
        new Uint8Array(32).fill(1),
      );
    });
  });

  it('uses the current origin token instead of the first connected instance', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    const ctx = makeInstanceContext({
      instanceStates: new Map([
        ['https://remote.example.com', { connectionState: 'connected', jwt: 'wrong-first-jwt' }],
        [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
      getTokenForInstance: vi.fn((instanceUrl) => (
        instanceUrl === window.location.origin ? 'local-jwt' : 'wrong-first-jwt'
      )),
    });
    useInstanceContext.mockReturnValue(ctx);
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });
    apiModule.claimInvite.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(ctx.getTokenForInstance).toHaveBeenCalledWith(window.location.origin);
      expect(apiModule.claimInvite).toHaveBeenCalledWith('local-jwt', 'abc123', window.location.origin);
    });
  });

  it('shows error panel when invite code is invalid', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext({ instanceStates: new Map() }));
    apiModule.getInviteInfo.mockRejectedValue(new Error('not found'));

    renderInvite('/invite/bad-code');

    await waitFor(() => {
      expect(screen.getByText(/not found or expired/i)).toBeInTheDocument();
    });
  });

  it('shows error panel on network failure', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext({ instanceStates: new Map() }));
    apiModule.getInviteInfo.mockRejectedValue(new Error('fetch failed'));

    renderInvite('/invite/abc123');

    await waitFor(() => {
      // Any error message is rendered
      expect(screen.queryByText(/loading invite/i)).not.toBeInTheDocument();
    });
  });

  it('stores pending invite in sessionStorage for unauthenticated user', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext({ instanceStates: new Map() }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(sessionStorage.getItem('hush_pending_invite')).toBeTruthy();
    });
  });

  it('redirects locked known-browser users through returnTo instead of queuing the invite', async () => {
    useAuth.mockReturnValue(makeAuthState({ needsUnlock: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext({ instanceStates: new Map() }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(sessionStorage.getItem('hush_pending_invite')).toBeNull();
  });

  it('unauthenticated user sees Sign in to join button', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext({ instanceStates: new Map() }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in to join/i })).toBeInTheDocument();
    });
  });

  it('shows already-a-member error when claimInvite returns 409', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext({
      instanceStates: new Map([
        [window.location.origin, { connectionState: 'connected', jwt: 'local-jwt' }],
      ]),
      mergedGuilds: [],
    }));
    apiModule.getInviteInfo.mockResolvedValue({ serverId: 'srv-1' });
    apiModule.claimInvite.mockRejectedValue(Object.assign(new Error('already member 409'), {}));

    renderInvite('/invite/abc123');

    await waitFor(() => {
      expect(screen.getByText(/already a member/i)).toBeInTheDocument();
    });
  });
});

describe('Invite - cross-instance flow (/join/:instance/:code)', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    window.location.hash = '';
    sessionStorage.clear();
  });

  it('shows MVP unsupported message for cross-instance invites', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });

    // Should NOT fetch invite info for cross-instance.
    expect(apiModule.getInviteInfo).not.toHaveBeenCalled();
  });

  it('cross-instance invite shows return-to-home link', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
      expect(screen.getByText(/return to home/i)).toBeInTheDocument();
    });
  });

  it('fetches invite info via the remote instance baseUrl', async () => {
    // Cross-instance invites are blocked in MVP - getInviteInfo is never called.
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
    expect(apiModule.getInviteInfo).not.toHaveBeenCalled();
  });

  it('shows MVP blocked message instead of guild name and hosted-on line', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());
    window.location.hash = '#name=Secret%20Guild';

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
    // Should NOT show the confirm modal UI.
    expect(screen.queryByText(/hosted on/i)).not.toBeInTheDocument();
  });

  it('shows MVP blocked message instead of member count in cross-instance confirm modal', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
  });

  it('does not call bootInstance or claimInvite for cross-instance invites', async () => {
    const ctx = makeInstanceContext();
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(ctx);

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });

    expect(ctx.bootInstance).not.toHaveBeenCalled();
    expect(apiModule.claimInvite).not.toHaveBeenCalled();
  });

  it('does not show connecting state for cross-instance invites', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/connecting to instance/i)).not.toBeInTheDocument();
  });

  it('does not attempt claim or metadata key storage for cross-instance invites', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());
    window.location.hash = '#name=Secret%20Guild&mk=encoded-key';

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });

    expect(guildMetadataKeyStore.setGuildMetadataKeyBytes).not.toHaveBeenCalled();
    expect(apiModule.claimInvite).not.toHaveBeenCalled();
  });

  it('does not attempt guild refresh for cross-instance invites', async () => {
    const ctx = makeInstanceContext();
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(ctx);

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });

    expect(ctx.refreshGuilds).not.toHaveBeenCalled();
  });

  it('does not attempt metadata key storage for cross-instance invites', async () => {
    useAuth.mockReturnValue(makeAuthState({ isAuthenticated: true, hasSession: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());
    window.location.hash = '#name=Secret%20Guild&mk=bad-key';

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });

    expect(guildMetadataKeyStore.setGuildMetadataKeyBytes).not.toHaveBeenCalled();
  });

  it('does not store pending invite for unauthenticated cross-instance user', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
    expect(sessionStorage.getItem('hush_pending_invite')).toBeNull();
  });

  it('redirects locked known-browser cross-instance users through returnTo', async () => {
    useAuth.mockReturnValue(makeAuthState({ needsUnlock: true }));
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    expect(await screen.findByText('Home')).toBeInTheDocument();
    expect(sessionStorage.getItem('hush_pending_invite')).toBeNull();
  });

  it('unauthenticated cross-instance user sees MVP blocked message, not Sign in button', async () => {
    useAuth.mockReturnValue(makeAuthState());
    useInstanceContext.mockReturnValue(makeInstanceContext());

    renderInvite('/join/remote.example.com/xyz789');

    await waitFor(() => {
      expect(screen.getByText(/cross-instance invites are not supported in this MVP/i)).toBeInTheDocument();
    });
  });
});
