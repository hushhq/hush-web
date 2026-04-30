import { useState, useEffect, useCallback, useRef } from 'react';
import { getGuildMembers, listBans, listMutes, unbanUser, unmuteUser, getAuditLog, leaveGuild, deleteGuild } from '../lib/api';
import ConfirmModal from './ConfirmModal';
import SettingsDialogShell from './layout/SettingsDialogShell';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { NativeSelect } from './ui/native-select.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';

const TAB_OVERVIEW = 'overview';
const TAB_MEMBERS = 'members';
const TAB_AUDIT_LOG = 'audit_log';
const TAB_BANS_MUTES = 'bans_mutes';



function getAuditBadgeClass(action) {
  const dangerActions = ['ban', 'kick', 'mute'];
  const safeActions = ['unban', 'unmute'];
  if (dangerActions.includes(action)) return 'settings-audit-badge settings-audit-badge--danger';
  if (safeActions.includes(action)) return 'settings-audit-badge settings-audit-badge--safe';
  if (action === 'message_delete') return 'settings-audit-badge settings-audit-badge--warn';
  return 'settings-audit-badge';
}


// ── Helpers ────────────────────────────────────────────────────────

const AUDIT_ACTIONS = ['kick', 'ban', 'unban', 'mute', 'unmute', 'message_delete', 'role_change'];
const ACTION_LABELS = {
  kick: 'Kick', ban: 'Ban', unban: 'Unban', mute: 'Mute', unmute: 'Unmute',
  message_delete: 'Message Delete', role_change: 'Role Change',
};
const PAGE_SIZE = 50;

function formatTime(iso) {
  if (!iso) return '\u2014';
  try {
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return iso; }
}

function resolveUser(userId, members) {
  if (!userId) return null;
  if (!members?.length) return userId.slice(0, 8) + '\u2026';
  const m = members.find((mem) => (mem.id ?? mem.userId) === userId);
  if (!m) return userId.slice(0, 8) + '\u2026';
  return m.username ?? m.displayName ?? m.id ?? userId;
}

function truncate(str, max) {
  if (!str) return '\u2014';
  if (str.length <= max) return str;
  return str.slice(0, max) + '\u2026';
}

// ── Tab: Overview ──────────────────────────────────────────────────

function OverviewTab({ serverName }) {
  return (
    <>
      <div className="settings-section-title">Overview</div>

      <div className="settings-field-row">
        <label className="settings-field-label">Server name</label>
        <div style={{ fontSize: '0.95rem', color: 'var(--hush-text)', padding: '8px 0' }}>
          {serverName || 'Unnamed server'}
        </div>
        <div className="settings-field-note">
          Server names are end-to-end encrypted. Only members can see this name.
        </div>
      </div>

    </>
  );
}

// ── Tab: Members ───────────────────────────────────────────────────

function MembersTab({ getToken, serverId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serverId) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    getGuildMembers(getToken(), serverId)
      .then((list) => { if (!cancelled) { setMembers(list); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err.message || 'Failed to load members'); setLoading(false); } });
    return () => { cancelled = true; };
  }, [getToken, serverId]);

  return (
    <>
      <div className="settings-section-title">
        Members{members.length > 0 ? ` \u2014 ${members.length}` : ''}
      </div>

      {loading && (
        <div style={{ color: 'var(--hush-text-muted)', fontSize: '0.85rem' }}>Loading\u2026</div>
      )}
      {error && <div className="settings-error-msg">{error}</div>}

      {!loading && !error && (
        <div className="settings-member-list">
          {members.map((m) => {
            const memberId = m.id ?? m.userId ?? '';
            // Prefer integer permissionLevel (new API), fall back to role string
            const level = m.permissionLevel ?? ({ owner: 3, admin: 2, mod: 1, member: 0 }[m.role] ?? 0);
            const isPrivileged = level >= 2;
            const roleLabel = ({ 3: 'Owner', 2: 'Admin', 1: 'Mod', 0: 'Member' }[level] ?? m.role ?? 'Member');
            const initial = (m.displayName || m.username || '?')[0].toUpperCase();
            return (
              <div key={memberId} className="settings-member-row">
                <div className="settings-member-avatar">{initial}</div>
                <span className="settings-member-name">{m.displayName || m.username}</span>
                <span className={`settings-member-role-badge${isPrivileged ? ' settings-member-role-badge--privileged' : ''}`}>
                  {roleLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Tab: Audit Log ─────────────────────────────────────────────────

function AuditLogTab({ getToken, serverId, showToast, members = [] }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const debounceTimer = useRef(null);

  const resolvedUserId = useCallback((search) => {
    if (!search.trim() || !members?.length) return undefined;
    const lower = search.trim().toLowerCase();
    const match = members.find((m) => {
      const name = (m.username ?? m.displayName ?? '').toLowerCase();
      return name.includes(lower);
    });
    return match ? (match.id ?? match.userId) : null;
  }, [members]);

  const fetchEntries = useCallback(async (currentOffset, replaceAll) => {
    const userId = resolvedUserId(userSearch);
    if (userSearch.trim() && userId === null) {
      setEntries([]);
      setHasMore(false);
      setLoading(false);
      setFetchError('');
      return;
    }

    setLoading(true);
    setFetchError('');
    try {
      const token = getToken();
      const opts = { limit: PAGE_SIZE, offset: currentOffset };
      if (actionFilter) opts.action = actionFilter;

      let fetched;
      if (userId) {
        const [byActor, byTarget] = await Promise.all([
          getAuditLog(token, serverId, { ...opts, actorId: userId }),
          getAuditLog(token, serverId, { ...opts, targetId: userId }),
        ]);
        const seen = new Set();
        fetched = [];
        for (const e of [...(byActor ?? []), ...(byTarget ?? [])]) {
          if (!seen.has(e.id)) { seen.add(e.id); fetched.push(e); }
        }
        fetched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        fetched = fetched.slice(0, PAGE_SIZE);
      } else {
        fetched = await getAuditLog(token, serverId, opts);
        fetched = fetched ?? [];
      }

      setHasMore(fetched.length >= PAGE_SIZE);
      if (replaceAll) { setEntries(fetched); } else { setEntries((prev) => [...prev, ...fetched]); }
    } catch (err) {
      setFetchError(err.message || 'Failed to load audit log.');
      showToast?.({ message: err.message || 'Failed to load audit log.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [actionFilter, userSearch, serverId, getToken, showToast, resolvedUserId]);

  useEffect(() => {
    setOffset(0);
    fetchEntries(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, serverId]);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setOffset(0);
      fetchEntries(0, true);
    }, 400);
    return () => clearTimeout(debounceTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSearch]);

  const handleLoadMore = useCallback(() => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchEntries(nextOffset, false);
  }, [offset, fetchEntries]);

  return (
    <>
      <div className="settings-section-title">Audit Log</div>

      <div className="settings-audit-filter-bar">
        <NativeSelect
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          aria-label="Audit action filter"
        >
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a] ?? a}</option>
          ))}
        </NativeSelect>
        <Input
          type="text"
          className="flex-1"
          placeholder="Search by username..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          aria-label="Search audit log by username"
        />
      </div>

      <div className="settings-audit-table-wrap">
        {loading && entries.length === 0 && (
          <div className="settings-audit-empty">Loading...</div>
        )}
        {!loading && fetchError && (
          <div className="settings-error-msg">{fetchError}</div>
        )}
        {!loading && !fetchError && entries.length === 0 && (
          <div className="settings-audit-empty">No audit log entries found.</div>
        )}
        {entries.length > 0 && (
          <>
            <table className="settings-audit-table">
              <thead>
                <tr>
                  <th className="settings-audit-th">Time</th>
                  <th className="settings-audit-th">Actor</th>
                  <th className="settings-audit-th">Target</th>
                  <th className="settings-audit-th">Action</th>
                  <th className="settings-audit-th">Reason</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const even = idx % 2 === 0;
                  const tdClass = `settings-audit-td${even ? ' settings-audit-td--even' : ''}`;
                  return (
                    <tr key={entry.id}>
                      <td className={tdClass} style={{ whiteSpace: 'nowrap', color: 'var(--hush-text-secondary)', fontSize: '0.75rem' }}>
                        {formatTime(entry.createdAt)}
                      </td>
                      <td className={tdClass} style={{ fontWeight: 500 }}>
                        {resolveUser(entry.actorId, members)}
                      </td>
                      <td className={tdClass} style={{ color: 'var(--hush-text-secondary)' }}>
                        {entry.targetId ? resolveUser(entry.targetId, members) : '\u2014'}
                      </td>
                      <td className={tdClass}>
                        <span className={getAuditBadgeClass(entry.action)}>
                          {ACTION_LABELS[entry.action] ?? entry.action}
                        </span>
                      </td>
                      <td className={tdClass} style={{ color: 'var(--hush-text-secondary)' }}>
                        <span title={entry.reason || ''}>
                          {truncate(entry.reason, 50)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {hasMore && (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}

// ── Tab: Bans & Mutes ──────────────────────────────────────────────

function ModerationRow({ entry, actionLabel, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!reason.trim()) { setError('Reason is required.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onAction(entry.userId, reason.trim());
    } catch (err) {
      setError(err.message || 'Action failed.');
      setSubmitting(false);
    }
  }, [reason, entry.userId, onAction]);

  return (
    <div className="settings-bm-row">
      <div className="settings-bm-row-header">
        <div>
          <div className="settings-bm-user-id">{entry.userId}</div>
          <div className="settings-bm-meta">
            Reason: {entry.reason}
            {' \u00b7 '}Banned: {formatDate(entry.createdAt)}
            {entry.expiresAt ? ` \u00b7 Expires: ${formatDate(entry.expiresAt)}` : ' \u00b7 Permanent'}
          </div>
        </div>
        {!expanded && (
          <Button type="button" variant="secondary" size="lg" onClick={() => setExpanded(true)}>
            {actionLabel}
          </Button>
        )}
      </div>
      {expanded && (
        <>
          <Input
            type="text"
            placeholder="Reason (required)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            autoFocus
          />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="settings-bm-reason-actions">
            <Button type="button" variant="ghost" size="lg" onClick={() => { setExpanded(false); setReason(''); setError(''); }} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" variant="default" size="lg" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : `Confirm ${actionLabel}`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function BansMutesTab({ getToken, serverId, showToast }) {
  const [subTab, setSubTab] = useState('bans');
  const [bans, setBans] = useState([]);
  const [mutes, setMutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setFetchError('');
      try {
        const token = getToken();
        const [fetchedBans, fetchedMutes] = await Promise.all([
          listBans(token, serverId),
          listMutes(token, serverId),
        ]);
        if (!cancelled) {
          setBans(fetchedBans ?? []);
          setMutes(fetchedMutes ?? []);
        }
      } catch (err) {
        if (!cancelled) setFetchError(err.message || 'Failed to load data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [serverId, getToken]);

  const handleUnban = useCallback(async (userId, reason) => {
    const token = getToken();
    await unbanUser(token, serverId, userId, reason);
    setBans((prev) => prev.filter((b) => b.userId !== userId));
    showToast?.({ message: 'User unbanned.', variant: 'success' });
  }, [getToken, serverId, showToast]);

  const handleUnmute = useCallback(async (userId, reason) => {
    const token = getToken();
    await unmuteUser(token, serverId, userId, reason);
    setMutes((prev) => prev.filter((m) => m.userId !== userId));
    showToast?.({ message: 'User unmuted.', variant: 'success' });
  }, [getToken, serverId, showToast]);

  const currentList = subTab === 'bans' ? bans : mutes;
  const actionLabel = subTab === 'bans' ? 'Unban' : 'Unmute';
  const handleAction = subTab === 'bans' ? handleUnban : handleUnmute;

  return (
    <>
      <div className="settings-section-title">Bans & Mutes</div>

      <div className="settings-bm-tab-bar">
        <button type="button" className={`settings-bm-tab${subTab === 'bans' ? ' settings-bm-tab--active' : ''}`} onClick={() => setSubTab('bans')}>
          Banned Users ({bans.length})
        </button>
        <button type="button" className={`settings-bm-tab${subTab === 'mutes' ? ' settings-bm-tab--active' : ''}`} onClick={() => setSubTab('mutes')}>
          Muted Users ({mutes.length})
        </button>
      </div>

      {loading && <div className="settings-bm-empty">Loading...</div>}
      {!loading && fetchError && <div className="settings-error-msg">{fetchError}</div>}
      {!loading && !fetchError && currentList.length === 0 && (
        <div className="settings-bm-empty">No active {subTab === 'bans' ? 'bans' : 'mutes'}.</div>
      )}
      {!loading && !fetchError && currentList.map((entry) => (
        <ModerationRow
          key={entry.id}
          entry={entry}
          actionLabel={actionLabel}
          onAction={handleAction}
        />
      ))}
    </>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────

/**
 * Full-screen server settings modal.
 * Sidebar navigation: Overview (owner-only), Members, Audit Log (admin), Bans & Mutes (admin).
 */
export default function ServerSettingsModal({
  getToken,
  serverId,
  instanceName,
  instanceData,
  isAdmin,
  myRole,
  onClose,
  showToast,
  members,
}) {
  const [tab, setTab] = useState(isAdmin ? TAB_OVERVIEW : TAB_MEMBERS);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLeaveServer = useCallback(async () => {
    try {
      await leaveGuild(getToken(), serverId);
      onClose();
    } catch (err) {
      showToast?.({ message: err.message || 'Failed to leave server', variant: 'error' });
      setShowLeaveConfirm(false);
    }
  }, [getToken, serverId, onClose, showToast]);

  const serverName = instanceName || 'Unnamed server';

  const handleDeleteServer = useCallback(async () => {
    if (deleteConfirmText !== serverName || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteGuild(getToken(), serverId);
      onClose();
      // Navigation handled by server_deleted WS event in ServerLayout
    } catch (err) {
      setIsDeleting(false);
      showToast?.({ message: err.message || 'Failed to delete server', variant: 'error' });
    }
  }, [deleteConfirmText, serverName, isDeleting, getToken, serverId, onClose, showToast]);

  const tabs = [
    ...(isAdmin ? [{ key: TAB_OVERVIEW, label: 'Overview' }] : []),
    { key: TAB_MEMBERS, label: 'Members' },
    ...(isAdmin ? [
      { key: TAB_AUDIT_LOG, label: 'Audit Log' },
      { key: TAB_BANS_MUTES, label: 'Bans & Mutes' },
    ] : []),
  ];

  const nav = (
    <>
      <div className="settings-sidebar-group">
        <div className="settings-sidebar-group-label">{instanceName ?? 'server'}</div>
        {tabs.filter(t => t.key === TAB_OVERVIEW || t.key === TAB_MEMBERS).map((t) => (
          <button
            key={t.key}
            type="button"
            className={`settings-sidebar-item${tab === t.key ? ' settings-sidebar-item--active' : ''}`}
            aria-current={tab === t.key ? 'page' : undefined}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {isAdmin && (
        <>
          <div className="settings-sidebar-divider" />
          <div className="settings-sidebar-group">
            <div className="settings-sidebar-group-label">Moderation</div>
            {tabs.filter(t => t.key === TAB_AUDIT_LOG || t.key === TAB_BANS_MUTES).map((t) => (
              <button
                key={t.key}
                type="button"
                className={`settings-sidebar-item${tab === t.key ? ' settings-sidebar-item--active' : ''}`}
                aria-current={tab === t.key ? 'page' : undefined}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );

  return (
    <SettingsDialogShell
      open
      onOpenChange={(next) => { if (!next) onClose(); }}
      title={instanceName ? `${instanceName} settings` : 'Server settings'}
      description="Manage server overview, members, audit log, and moderation."
      nav={nav}
    >
        {tab === TAB_OVERVIEW && isAdmin && (
          <>
            <OverviewTab serverName={instanceName} />

            {/* Danger Zone — only in the Overview tab for admins */}
            {myRole === 'owner' ? (
              <div className="settings-danger-zone">
                <div className="settings-danger-title">Danger Zone</div>
                <p className="settings-danger-action-text" style={{ marginBottom: 12 }}>
                  Permanently delete this server and all its channels, messages, and members. This cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Server
                  </Button>
                ) : (
                  <div className="settings-delete-confirm">
                    <p className="settings-danger-action-text">
                      Type the server name to confirm: <strong>{serverName}</strong>
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type server name..."
                      autoFocus
                      aria-label="Confirm server name"
                    />
                    <div className="settings-delete-actions">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="lg"
                        disabled={deleteConfirmText !== serverName || isDeleting}
                        onClick={handleDeleteServer}
                      >
                        {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="settings-danger-zone">
                <div className="settings-danger-title">Danger Zone</div>
                <div className="settings-danger-action">
                  <span className="settings-danger-action-text">
                    Leave this server. You will lose access to all channels.
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={() => setShowLeaveConfirm(true)}
                  >
                    Leave Server
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {tab === TAB_MEMBERS && (
          <>
            <MembersTab
              getToken={getToken}
              serverId={serverId}
            />

            {/* Danger Zone — only in the Members tab for non-admins (who cannot see Overview) */}
            {!isAdmin && (
              <div className="settings-danger-zone">
                <div className="settings-danger-title">Danger Zone</div>
                <div className="settings-danger-action">
                  <span className="settings-danger-action-text">
                    Leave this server. You will lose access to all channels.
                  </span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={() => setShowLeaveConfirm(true)}
                  >
                    Leave Server
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {tab === TAB_AUDIT_LOG && isAdmin && (
          <AuditLogTab
            getToken={getToken}
            serverId={serverId}
            showToast={showToast}
            members={members}
          />
        )}
        {tab === TAB_BANS_MUTES && isAdmin && (
          <BansMutesTab
            getToken={getToken}
            serverId={serverId}
            showToast={showToast}
          />
        )}

      {showLeaveConfirm && (
        <ConfirmModal
          title="Leave Server"
          message={`Are you sure you want to leave "${instanceName}"? You will need a new invite to rejoin.`}
          confirmLabel="Leave"
          onConfirm={handleLeaveServer}
          onCancel={() => setShowLeaveConfirm(false)}
        />
      )}
    </SettingsDialogShell>
  );
}
