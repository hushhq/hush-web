import { InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * Empty-state shell shown when the user has no guild selected.
 *
 * Reuses the same `.app-shell` wrapper as `AuthenticatedAppShell` so the
 * empty path and selected path share a single shell contract. The empty
 * state surface fills the workspace column instead of the
 * sidebar+main pair.
 */
export default function EmptyServerShell({
  serverListEl,
  emptyStateEl,
  guildCreateModal,
  hasNoTransparencyLog,
  authToken,
  toastEl,
}) {
  return (
    <div
      className="app-shell app-shell--empty lay-container"
      data-slot="app-shell"
      data-state="empty"
      style={{ overflow: 'hidden' }}
    >
      <div
        className="app-shell__server-rail"
        data-slot="app-shell-server-rail"
      >
        {serverListEl}
      </div>

      <div
        className="app-shell__workspace lay-main"
        data-slot="app-shell-workspace"
      >
        <div
          className="app-shell__main lay-channel-area"
          data-slot="app-shell-main"
        >
          {emptyStateEl}
        </div>
      </div>

      {guildCreateModal}

      {hasNoTransparencyLog && authToken && (
        <div
          className="transp-no-log-badge"
          title="Transparency log not configured - key operations cannot be independently verified"
          aria-label="Transparency log not configured"
        >
          <InfoCircledIcon width="16" height="16" aria-hidden="true" />
        </div>
      )}

      {toastEl}
    </div>
  );
}
