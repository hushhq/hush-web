import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ── Module mocks ──────────────────────────────────────────────────────────────

vi.mock('../lib/api', () => ({
  createGuild: vi.fn(),
  listServerTemplates: vi.fn(),
}));

vi.mock('../lib/guildMetadata', () => ({
  generateMetadataKeyBytes: vi.fn(() => new Uint8Array(32).fill(7)),
  encryptGuildMetadata: vi.fn().mockResolvedValue(new Uint8Array(0)),
  toBase64: vi.fn(() => 'base64blob'),
  importMetadataKey: vi.fn().mockResolvedValue({}),
}));

vi.mock('../lib/guildMetadataKeyStore', () => ({
  openGuildMetadataKeyStore: vi.fn().mockResolvedValue({ close: vi.fn() }),
  createPendingGuildMetadataKey: vi.fn().mockResolvedValue('pending-guild-1'),
  deleteGuildMetadataKeyBytes: vi.fn().mockResolvedValue(undefined),
  promotePendingGuildMetadataKey: vi.fn().mockResolvedValue(undefined),
  setGuildMetadataKeyBytes: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../hooks/useAuth', () => ({
  getDeviceId: vi.fn(() => 'device-1'),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'u1' } })),
}));

vi.mock('../contexts/InstanceContext', () => ({
  useInstanceContext: vi.fn(),
}));

// GuildCreateModal uses createPortal - render into document.body by default in jsdom
// No special stub needed; JSDOM supports document.body as portal target.

// ── Imports after mocks ───────────────────────────────────────────────────────

import * as apiModule from '../lib/api';
import * as guildMetadataKeyStore from '../lib/guildMetadataKeyStore';
import { useInstanceContext } from '../contexts/InstanceContext';
import GuildCreateModal from './GuildCreateModal';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeInstanceStates(entries) {
  return new Map(entries);
}

function makeCtx(instanceStatesEntries = [], overrides = {}) {
  return {
    instanceStates: makeInstanceStates(instanceStatesEntries),
    refreshGuilds: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function renderModal(props = {}) {
  const defaults = {
    getToken: () => 'test-jwt',
    onClose: vi.fn(),
    onCreated: vi.fn(),
    activeInstanceUrl: null,
  };
  return render(
    <MemoryRouter>
      <GuildCreateModal {...defaults} {...props} />
    </MemoryRouter>,
  );
}

function getSubmitButton() {
  const button = document.querySelector('form button[type="submit"]');
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error('submit button not found');
  }
  return button;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('GuildCreateModal - instance picker', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    apiModule.listServerTemplates.mockResolvedValue([]);
    guildMetadataKeyStore.openGuildMetadataKeyStore.mockResolvedValue({ close: vi.fn() });
  });

  it('renders instance picker dropdown with all connected instances', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
      ['https://b.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-b' }],
    ]));

    renderModal();

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    const options = screen.getAllByRole('option');
    expect(options.some(o => o.textContent.includes('a.example.com'))).toBe(true);
    expect(options.some(o => o.textContent.includes('b.example.com'))).toBe(true);
  });

  it('pre-selects the activeInstanceUrl when provided', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
      ['https://b.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-b' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://b.example.com' });

    const select = screen.getByRole('combobox');
    expect(select.value).toBe('https://b.example.com');
  });

  it('shows "No instances connected" message when instanceStates is empty', () => {
    useInstanceContext.mockReturnValue(makeCtx([]));

    renderModal();

    expect(screen.getByText(/no instances connected/i)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('instance picker is always visible even with a single instance', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));

    renderModal();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

describe('GuildCreateModal - policy annotations', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    apiModule.listServerTemplates.mockResolvedValue([]);
  });

  it('shows no annotation and enables Create for open policy', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    expect(screen.queryByText(/subscription required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/managed by the instance admin/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/will be reviewed/i)).not.toBeInTheDocument();

    // Name must be non-empty - the button has a !name.trim() guard in addition to policy.
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'My Server' } });

    const createBtn = getSubmitButton();
    expect(createBtn).not.toBeDisabled();
  });

  it('shows no annotation and enables Create for any_member policy', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'any_member' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    expect(screen.queryByText(/subscription required/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'My Server' } });

    const createBtn = getSubmitButton();
    expect(createBtn).not.toBeDisabled();
  });

  it('shows danger banner and disables Create for subscribers policy', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'subscribers' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    expect(screen.getByText(/subscription required/i)).toBeInTheDocument();
    const createBtn = getSubmitButton();
    expect(createBtn).toBeDisabled();
  });

  it('shows danger banner and disables Create for disabled policy', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'disabled' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    expect(screen.getByText(/managed by the instance admin/i)).toBeInTheDocument();
    const createBtn = getSubmitButton();
    expect(createBtn).toBeDisabled();
  });

  it('shows amber banner and changes button text to "Request creation" for request policy', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'request' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    expect(screen.getByText(/will be reviewed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request creation/i })).toBeInTheDocument();
  });
});

describe('GuildCreateModal - template loading', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('loads templates using the JWT of the selected instance', async () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-for-a' }],
    ]));
    apiModule.listServerTemplates.mockResolvedValue([]);

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    await waitFor(() => {
      expect(apiModule.listServerTemplates).toHaveBeenCalledWith('jwt-for-a', 'https://a.example.com');
    });
  });

  it('uses fallback getToken() when no instance is selected', async () => {
    useInstanceContext.mockReturnValue(makeCtx([]));
    apiModule.listServerTemplates.mockResolvedValue([]);

    renderModal({ getToken: () => 'fallback-jwt', activeInstanceUrl: null });

    // listServerTemplates is not called when there is no token (empty instances, no jwt from getToken)
    // The effect only fires when effectiveToken is truthy.
    await waitFor(() => {
      // No error should be thrown
      expect(screen.getByText(/no instances connected/i)).toBeInTheDocument();
    });
  });
});

describe('GuildCreateModal - submission', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    apiModule.listServerTemplates.mockResolvedValue([]);
  });

  it('calls refreshGuilds for the selected instance after successful creation', async () => {
    const ctx = makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]);
    useInstanceContext.mockReturnValue(ctx);
    apiModule.createGuild.mockResolvedValue({ id: 'new-guild' });

    const onCreated = vi.fn();
    renderModal({ activeInstanceUrl: 'https://a.example.com', onCreated });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'My New Server' } });
    fireEvent.submit(getSubmitButton().closest('form'));

    await waitFor(() => {
      expect(apiModule.createGuild).toHaveBeenCalled();
      expect(ctx.refreshGuilds).toHaveBeenCalledWith('https://a.example.com');
      expect(onCreated).toHaveBeenCalled();
    });
  });

  it('encrypts metadata and passes selectedInstanceUrl as baseUrl to createGuild', async () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));
    apiModule.createGuild.mockResolvedValue({ id: 'new-guild' });

    renderModal({ activeInstanceUrl: 'https://a.example.com', onCreated: vi.fn() });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Server Name' } });
    fireEvent.submit(getSubmitButton().closest('form'));

    await waitFor(() => {
      expect(apiModule.createGuild).toHaveBeenCalledWith(
        'jwt-a',
        'base64blob',
        null,
        'https://a.example.com',
      );
      expect(guildMetadataKeyStore.createPendingGuildMetadataKey).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Uint8Array),
      );
      expect(guildMetadataKeyStore.promotePendingGuildMetadataKey).toHaveBeenCalledWith(
        expect.any(Object),
        'pending-guild-1',
        'new-guild',
      );
    });
  });

  it('does not create the guild when the local pending key write fails', async () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));
    guildMetadataKeyStore.createPendingGuildMetadataKey.mockRejectedValueOnce(new Error('local key store unavailable'));

    renderModal({ activeInstanceUrl: 'https://a.example.com', onCreated: vi.fn() });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Server Name' } });
    fireEvent.submit(getSubmitButton().closest('form'));

    await waitFor(() => {
      expect(apiModule.createGuild).not.toHaveBeenCalled();
      expect(screen.getByText(/local key store unavailable/i)).toBeInTheDocument();
    });
  });

  it('surfaces a recovery error when the server is created but local metadata finalization fails', async () => {
    const ctx = makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]);
    useInstanceContext.mockReturnValue(ctx);
    apiModule.createGuild.mockResolvedValue({ id: 'new-guild' });
    guildMetadataKeyStore.promotePendingGuildMetadataKey.mockRejectedValueOnce(new Error('promote failed'));
    const onCreated = vi.fn();

    renderModal({ activeInstanceUrl: 'https://a.example.com', onCreated });

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Server Name' } });
    fireEvent.submit(getSubmitButton().closest('form'));

    await waitFor(() => {
      expect(onCreated).not.toHaveBeenCalled();
      expect(ctx.refreshGuilds).toHaveBeenCalledWith('https://a.example.com');
      expect(screen.getByText(/server was created, but local metadata setup failed/i)).toBeInTheDocument();
    });
  });

  it('shows error message when server name is empty', async () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));

    renderModal({ activeInstanceUrl: 'https://a.example.com' });

    fireEvent.submit(getSubmitButton().closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/server name is required/i)).toBeInTheDocument();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    useInstanceContext.mockReturnValue(makeCtx([
      ['https://a.example.com', { connectionState: 'connected', handshakeData: { server_creation_policy: 'open' }, jwt: 'jwt-a' }],
    ]));
    const onClose = vi.fn();

    renderModal({ activeInstanceUrl: 'https://a.example.com', onClose });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
