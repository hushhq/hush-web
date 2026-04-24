import { useCallback, useState } from 'react';
import {
  DEFAULT_AUTH_INSTANCE_URL,
  getInstanceDisplayName,
} from '../../lib/authInstanceStore';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui';

export function AuthInstanceSelector({
  value,
  instances,
  onSelect,
  disabled = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const commitSelection = useCallback(async (candidate) => {
    if (disabled) return;
    setIsSaving(true);
    setError('');
    try {
      await onSelect(candidate);
      setDraft('');
      setOpen(false);
    } catch (err) {
      setError(err?.message || 'Enter a valid instance URL.');
    } finally {
      setIsSaving(false);
    }
  }, [disabled, onSelect]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (!draft.trim()) {
      setError('Enter an instance URL.');
      return;
    }
    await commitSelection(draft);
  }, [commitSelection, draft]);

  const handleOpenChange = useCallback((next) => {
    setOpen(next);
    if (!next) setError('');
  }, []);

  return (
    <div className={`ais${compact ? ' ais--compact' : ''}`}>
      <div className="ais__label">Instance</div>

      <DropdownMenuRoot open={open} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="ais__trigger"
            disabled={disabled}
            title={value}
            aria-label={`Connection instance: ${getInstanceDisplayName(value)}`}
          >
            <span className="ais__trigger-name">{getInstanceDisplayName(value)}</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="ais__trigger-icon"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
        >
          <DropdownMenuLabel>Switch instance</DropdownMenuLabel>

          {instances.map((instance) => {
            const isActive = instance.url === value;
            const isDefault = instance.url === DEFAULT_AUTH_INSTANCE_URL;

            return (
              <button
                key={instance.url}
                type="button"
                className={`ais__item${isActive ? ' ais__item--active' : ''}`}
                onClick={() => commitSelection(instance.url)}
                disabled={isSaving}
              >
                <span className="ais__item-body">
                  <span className="ais__item-name">{getInstanceDisplayName(instance.url)}</span>
                  <span className="ais__item-sub">
                    {isDefault
                      ? 'Pinned default'
                      : instance.lastUsedAt
                        ? `Last used ${new Date(instance.lastUsedAt).toLocaleDateString()}`
                        : 'Saved instance'}
                  </span>
                </span>
                {isActive && <span className="ais__item-badge">Current</span>}
              </button>
            );
          })}

          <DropdownMenuSeparator />

          <form className="ais__form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add custom instance"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              disabled={isSaving}
            />
            <button type="submit" className="btn btn-secondary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Add custom instance'}
            </button>
          </form>

          {error && <div className="ais__error">{error}</div>}
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </div>
  );
}
