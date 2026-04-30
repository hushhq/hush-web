import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog.tsx';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { NativeSelect } from './ui/native-select.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.tsx';
import { Alert, AlertDescription } from './ui/alert.tsx';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from './ui/field.tsx';
import { createGuild, listServerTemplates } from '../lib/api';
import { parseInviteLink } from '../lib/inviteLinks.js';
import {
  encryptGuildMetadata,
  generateMetadataKeyBytes,
  importMetadataKey,
  toBase64,
} from '../lib/guildMetadata';
import { getDeviceId } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';
import { useInstanceContext } from '../contexts/InstanceContext';
import {
  createPendingGuildMetadataKey,
  deleteGuildMetadataKeyBytes,
  openGuildMetadataKeyStore,
  promotePendingGuildMetadataKey,
} from '../lib/guildMetadataKeyStore';

const GUILD_METADATA_SETUP_ERROR =
  'Server was created, but local metadata setup failed on this device. Refresh the server list and relink this device if the name stays unavailable.';

async function storePendingMetadataKey(userId, keyBytes) {
  const db = await openGuildMetadataKeyStore(userId, getDeviceId());
  try {
    return await createPendingGuildMetadataKey(db, keyBytes);
  } finally {
    db.close();
  }
}

async function promoteMetadataKey(userId, pendingGuildId, guildId) {
  const db = await openGuildMetadataKeyStore(userId, getDeviceId());
  try {
    await promotePendingGuildMetadataKey(db, pendingGuildId, guildId);
  } finally {
    db.close();
  }
}

async function deleteMetadataKey(userId, guildId) {
  const db = await openGuildMetadataKeyStore(userId, getDeviceId());
  try {
    await deleteGuildMetadataKeyBytes(db, guildId);
  } finally {
    db.close();
  }
}

// ── Instance creation policy annotations ─────────────────────────────────────

/**
 * Maps instance server_creation_policy to { label, disabled, buttonLabel }.
 * @param {string|undefined} policy
 * @returns {{ annotation: string|null, disabled: boolean, buttonLabel: string }}
 */
function getPolicyState(policy) {
  switch (policy) {
    case 'subscribers':
      return {
        annotation: 'Subscription required to create servers.',
        disabled: true,
        buttonLabel: 'Create',
      };
    case 'disabled':
      return {
        annotation: 'Server creation is managed by the instance admin.',
        disabled: true,
        buttonLabel: 'Create',
      };
    case 'request':
      return {
        annotation: 'Your request will be reviewed by the instance admin.',
        disabled: false,
        buttonLabel: 'Request creation',
      };
    case 'open':
    case 'any_member':
    default:
      return { annotation: null, disabled: false, buttonLabel: 'Create' };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Guild creation modal - server name input, instance picker, template picker.
 *
 * Instance picker is ALWAYS visible (even with one instance) to teach the
 * multi-instance model. Pre-selected to the instance of the currently active
 * guild, or the first connected instance.
 *
 * @param {{
 *   getToken: () => string|null,
 *   onClose: () => void,
 *   onCreated: (guild: object) => void,
 *   activeInstanceUrl?: string|null,
 * }} props
 */
export default function GuildCreateModal({ getToken, onClose, onCreated, activeInstanceUrl }) {
  const navigate = useNavigate();

  // ── Tab state ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('create');
  const [inviteInput, setInviteInput] = useState('');
  const [joinError, setJoinError] = useState(null);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setJoinError(null);
  }, []);

  const handleJoin = useCallback(() => {
    setJoinError(null);
    const parsed = parseInviteLink(inviteInput);
    if (!parsed) {
      setJoinError('Invalid invite link. Paste a Hush invite URL or code.');
      return;
    }
    onClose();
    if (parsed.instanceHost) {
      navigate(`/join/${parsed.instanceHost}/${parsed.code}`);
    } else {
      navigate(`/invite/${parsed.code}`);
    }
  }, [inviteInput, navigate, onClose]);

  // ── Create form state ──────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Template picker state
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);

  // ── Instance context ───────────────────────────────────────────────────

  const { user } = useAuth();
  const { instanceStates, refreshGuilds } = useInstanceContext();

  /** List of connected instances sorted by URL for stable display order. */
  const connectedInstances = useMemo(() => {
    const entries = [];
    for (const [url, state] of instanceStates) {
      if (state.connectionState === 'connected') {
        entries.push({ url, state });
      }
    }
    entries.sort((a, b) => a.url.localeCompare(b.url));
    return entries;
  }, [instanceStates]);

  /** Pre-select the active guild's instance, or the first connected instance. */
  const defaultInstanceUrl = activeInstanceUrl ?? connectedInstances[0]?.url ?? null;
  const [selectedInstanceUrl, setSelectedInstanceUrl] = useState(defaultInstanceUrl);

  // Update selected instance when context loads if not yet set.
  useEffect(() => {
    if (!selectedInstanceUrl && connectedInstances.length > 0) {
      setSelectedInstanceUrl(connectedInstances[0].url);
    }
  }, [connectedInstances, selectedInstanceUrl]);

  // Re-derive policy from selected instance's handshake data.
  const selectedHandshake = instanceStates.get(selectedInstanceUrl ?? '')?.handshakeData ?? null;
  const creationPolicy = selectedHandshake?.server_creation_policy ?? selectedHandshake?.server_creation_policy_value ?? null;
  const { annotation, disabled: policyDisabled, buttonLabel } = getPolicyState(creationPolicy);

  // ── Load templates for selected instance ──────────────────────────────

  useEffect(() => {
    const effectiveToken = selectedInstanceUrl
      ? (instanceStates.get(selectedInstanceUrl)?.jwt ?? getToken())
      : getToken();
    if (!effectiveToken) return;

    setTemplates([]);
    setSelectedTemplateId(null);
    setTemplatesLoaded(false);

    (async () => {
      try {
        const data = await listServerTemplates(effectiveToken, selectedInstanceUrl ?? undefined);
        if (Array.isArray(data) && data.length > 0) {
          setTemplates(data);
          const def = data.find(t => t.isDefault);
          setSelectedTemplateId(def ? def.id : data[0].id);
        }
      } catch {
        // Templates are optional - server uses its default on failure.
      }
      setTemplatesLoaded(true);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstanceUrl]);

  // ── Submit ────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Server name is required.');
      return;
    }

    // Use per-instance JWT for the selected instance, fall back to prop getToken().
    const effectiveToken = selectedInstanceUrl
      ? (instanceStates.get(selectedInstanceUrl)?.jwt ?? getToken())
      : getToken();
    const effectiveBaseUrl = selectedInstanceUrl ?? undefined;

    if (!effectiveToken) {
      setError('Not authenticated.');
      return;
    }
    if (!user?.id) {
      setError('User context is not available.');
      return;
    }

    setLoading(true);
    let pendingGuildId = null;
    try {
      const metadataKeyBytes = generateMetadataKeyBytes();
      pendingGuildId = await storePendingMetadataKey(user.id, metadataKeyBytes);
      const symmetricKey = await importMetadataKey(metadataKeyBytes);
      const encryptedMetadata = toBase64(await encryptGuildMetadata(symmetricKey, {
        name: trimmed,
        description: '',
        icon: null,
      }));
      const guild = await createGuild(
        effectiveToken,
        encryptedMetadata,
        selectedTemplateId,
        effectiveBaseUrl,
      );
      try {
        await promoteMetadataKey(user.id, pendingGuildId, guild.id);
      } catch {
        if (selectedInstanceUrl) {
          refreshGuilds(selectedInstanceUrl).catch(() => {});
        }
        throw new Error(GUILD_METADATA_SETUP_ERROR);
      }

      guild.encryptedMetadata = encryptedMetadata;
      guild._localName = trimmed;

      if (selectedInstanceUrl) {
        refreshGuilds(selectedInstanceUrl).catch(() => {});
      }

      onCreated(guild);
    } catch (err) {
      if (pendingGuildId) {
        await deleteMetadataKey(user.id, pendingGuildId).catch(() => {});
      }
      setError(err.message || 'Failed to create server.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{activeTab === 'create' ? 'Create a server' : 'Join a server'}</DialogTitle>
          <DialogDescription className="sr-only">
            {activeTab === 'create'
              ? 'Create a new server: name it, pick an instance, choose a template.'
              : 'Join an existing server with an invite link or code.'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={switchTab}>
          <TabsList className="w-full">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="guild-name">Server name</FieldLabel>
                  <Input
                    id="guild-name"
                    name="guild-name"
                    type="text"
                    placeholder="My server"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    maxLength={100}
                    autoComplete="off"
                    autoFocus
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="guild-instance">Instance</FieldLabel>
                  {connectedInstances.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-1">No instances connected.</p>
                  ) : (
                    <NativeSelect
                      className="w-full"
                      id="guild-instance"
                      value={selectedInstanceUrl ?? ''}
                      onChange={(e) => setSelectedInstanceUrl(e.target.value || null)}
                    >
                      {connectedInstances.map(({ url }) => {
                        const host = (() => {
                          try { return new URL(url).host; } catch { return url; }
                        })();
                        return (
                          <option key={url} value={url}>{host}</option>
                        );
                      })}
                    </NativeSelect>
                  )}
                </Field>
              </FieldGroup>

              {annotation && (
                <div className={`gcm-policy-note${policyDisabled ? ' gcm-policy-note--disabled' : ' gcm-policy-note--request'}`}>
                  {annotation}
                </div>
              )}

              {templatesLoaded && templates.length > 1 && (
                <FieldSet>
                  <FieldLegend variant="label">Template</FieldLegend>
                  <div className="gcm-template-list">
                    {templates.map(tmpl => (
                      <label
                        key={tmpl.id}
                        className={`gcm-template-item${selectedTemplateId === tmpl.id ? ' gcm-template-item--selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={tmpl.id}
                          checked={selectedTemplateId === tmpl.id}
                          onChange={() => setSelectedTemplateId(tmpl.id)}
                          className="accent-primary"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="gcm-template-name">
                            {tmpl.name}
                            {tmpl.isDefault && <span className="gcm-template-default-tag">(default)</span>}
                          </div>
                          <div className="gcm-template-channels">
                            {tmpl.channels.filter(c => c.type !== 'system').map(c => c.type === 'voice' ? `${c.name} (voice)` : `#${c.name}`).join(', ') || 'system only'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </FieldSet>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="button" variant="ghost" size="lg" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={loading || !name.trim() || policyDisabled || connectedInstances.length === 0}
                >
                  {loading ? 'Creating…' : buttonLabel}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="join">
            <div className="flex flex-col gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="invite-input">Invite link</FieldLabel>
                  <Input
                    id="invite-input"
                    name="invite-input"
                    type="text"
                    placeholder="https://… or invite code"
                    value={inviteInput}
                    onChange={(e) => { setInviteInput(e.target.value); setJoinError(null); }}
                    autoComplete="off"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleJoin(); } }}
                  />
                </Field>
              </FieldGroup>
              {joinError && (
                <Alert variant="destructive">
                  <AlertDescription>{joinError}</AlertDescription>
                </Alert>
              )}
              <DialogFooter>
                <Button type="button" variant="ghost" size="lg" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  disabled={!inviteInput.trim()}
                  onClick={handleJoin}
                >
                  Join server
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
