import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import DmListView from './DmListView';

vi.mock('../lib/api', () => ({
  searchUsersForDM: vi.fn().mockResolvedValue([]),
  createOrFindDM: vi.fn(),
}));

import { createOrFindDM, searchUsersForDM } from '../lib/api';

const dmGuilds = [
  { id: 'dm-1', isDm: true, channelId: 'ch-1', channels: [{ id: 'ch-1', unreadCount: 2 }], otherUser: { displayName: 'Alice', username: 'alice' } },
  { id: 'dm-2', isDm: true, channelId: 'ch-2', channels: [{ id: 'ch-2', unreadCount: 0 }], otherUser: { displayName: 'Bob', username: 'bob' } },
];

describe('DmListView', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // ── DM list is fed from the real DM collection ───────────────────────────

  it('renders DM guilds passed as prop', () => {
    render(<DmListView dmGuilds={dmGuilds} onSelectDm={vi.fn()} getToken={() => 'tok'} instanceUrl="http://localhost" />);
    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('shows empty state when dmGuilds is empty', () => {
    render(<DmListView dmGuilds={[]} onSelectDm={vi.fn()} getToken={() => 'tok'} instanceUrl="http://localhost" />);
    expect(screen.getByText('No conversations yet')).toBeTruthy();
  });

  it('empty state does not appear when dmGuilds is non-empty', () => {
    render(<DmListView dmGuilds={dmGuilds} onSelectDm={vi.fn()} getToken={() => 'tok'} instanceUrl="http://localhost" />);
    expect(screen.queryByText('No conversations yet')).toBeNull();
  });

  // ── Selecting a DM navigates correctly ───────────────────────────────────

  it('calls onSelectDm with the guild object when a DM item is clicked', () => {
    const onSelectDm = vi.fn();
    render(<DmListView dmGuilds={dmGuilds} onSelectDm={onSelectDm} getToken={() => 'tok'} instanceUrl="http://localhost" />);
    fireEvent.click(screen.getByText('Alice'));
    expect(onSelectDm).toHaveBeenCalledTimes(1);
    expect(onSelectDm).toHaveBeenCalledWith(dmGuilds[0]);
  });

  // ── createOrFindDM response is unwrapped before onSelectDm ───────────────

  it('unwraps DMResponse envelope before calling onSelectDm from search', async () => {
    const onSelectDm = vi.fn();
    vi.mocked(searchUsersForDM).mockResolvedValue([{ id: 'u-99', username: 'carol', displayName: 'Carol' }]);
    vi.mocked(createOrFindDM).mockResolvedValue({
      server: { id: 'dm-new', isDm: true, accessPolicy: 'closed' },
      otherUser: { id: 'u-99', username: 'carol', displayName: 'Carol' },
      channelId: 'ch-new',
    });

    render(<DmListView dmGuilds={[]} onSelectDm={onSelectDm} getToken={() => 'tok'} instanceUrl="http://localhost" />);

    // Open search
    fireEvent.click(screen.getByTitle('New message'));
    const input = screen.getByPlaceholderText('Find a user...');
    fireEvent.change(input, { target: { value: 'carol' } });

    await waitFor(() => expect(screen.getByText('Carol')).toBeTruthy());
    fireEvent.click(screen.getByText('Carol'));

    await waitFor(() => expect(onSelectDm).toHaveBeenCalledTimes(1));

    const arg = onSelectDm.mock.calls[0][0];
    // Must receive a guild-like object (server fields), NOT the raw DMResponse wrapper
    expect(arg.id).toBe('dm-new');
    expect(arg.channelId).toBe('ch-new');
    expect(arg.server).toBeUndefined(); // raw envelope must NOT be forwarded
  });

  it('does not call onSelectDm when createOrFindDM returns no server', async () => {
    const onSelectDm = vi.fn();
    vi.mocked(searchUsersForDM).mockResolvedValue([{ id: 'u-99', username: 'carol', displayName: 'Carol' }]);
    vi.mocked(createOrFindDM).mockResolvedValue({ server: null, channelId: null });

    render(<DmListView dmGuilds={[]} onSelectDm={onSelectDm} getToken={() => 'tok'} instanceUrl="http://localhost" />);
    fireEvent.click(screen.getByTitle('New message'));
    const input = screen.getByPlaceholderText('Find a user...');
    fireEvent.change(input, { target: { value: 'carol' } });

    await waitFor(() => expect(screen.getByText('Carol')).toBeTruthy());
    fireEvent.click(screen.getByText('Carol'));

    await waitFor(() => expect(createOrFindDM).toHaveBeenCalled());
    expect(onSelectDm).not.toHaveBeenCalled();
  });

  // ── instanceUrl is forwarded through the API call and normalized object ──────

  it('passes instanceUrl as baseUrl to createOrFindDM', async () => {
    vi.mocked(searchUsersForDM).mockResolvedValue([{ id: 'u-99', username: 'carol', displayName: 'Carol' }]);
    vi.mocked(createOrFindDM).mockResolvedValue({
      server: { id: 'dm-new', isDm: true, accessPolicy: 'closed' },
      otherUser: { id: 'u-99', username: 'carol', displayName: 'Carol' },
      channelId: 'ch-new',
    });

    render(<DmListView dmGuilds={[]} onSelectDm={vi.fn()} getToken={() => 'tok'} instanceUrl="http://my-instance.example.com" />);
    fireEvent.click(screen.getByTitle('New message'));
    fireEvent.change(screen.getByPlaceholderText('Find a user...'), { target: { value: 'carol' } });
    await waitFor(() => expect(screen.getByText('Carol')).toBeTruthy());
    fireEvent.click(screen.getByText('Carol'));

    await waitFor(() => expect(createOrFindDM).toHaveBeenCalled());
    expect(createOrFindDM).toHaveBeenCalledWith('tok', 'u-99', 'http://my-instance.example.com');
  });

  it('includes instanceUrl in the normalized guild object passed to onSelectDm', async () => {
    const onSelectDm = vi.fn();
    vi.mocked(searchUsersForDM).mockResolvedValue([{ id: 'u-99', username: 'carol', displayName: 'Carol' }]);
    vi.mocked(createOrFindDM).mockResolvedValue({
      server: { id: 'dm-new', isDm: true, accessPolicy: 'closed' },
      otherUser: { id: 'u-99', username: 'carol', displayName: 'Carol' },
      channelId: 'ch-new',
    });

    render(<DmListView dmGuilds={[]} onSelectDm={onSelectDm} getToken={() => 'tok'} instanceUrl="http://my-instance.example.com" />);
    fireEvent.click(screen.getByTitle('New message'));
    fireEvent.change(screen.getByPlaceholderText('Find a user...'), { target: { value: 'carol' } });
    await waitFor(() => expect(screen.getByText('Carol')).toBeTruthy());
    fireEvent.click(screen.getByText('Carol'));

    await waitFor(() => expect(onSelectDm).toHaveBeenCalledTimes(1));

    const arg = onSelectDm.mock.calls[0][0];
    expect(arg.id).toBe('dm-new');
    expect(arg.channelId).toBe('ch-new');
    // instanceUrl must be forwarded so handleDmSelect can refresh the correct instance.
    expect(arg.instanceUrl).toBe('http://my-instance.example.com');
    expect(arg.server).toBeUndefined();
  });
});
