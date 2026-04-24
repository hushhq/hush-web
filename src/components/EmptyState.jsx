/**
 * EmptyState - shown in the main content area when the user has no guild memberships.
 *
 * Rebuilt with Radix Themes primitives for layout, typography, and iconography
 * so the surface is consistent with the rest of the system.
 *
 * Renders:
 *   1. Welcome heading
 *   2. "Create a server" primary button (always rendered; disabled when no instance
 *      allows creation, with explanatory text)
 *   3. "Browse public servers" secondary button
 *   4. Invite link explanation paragraph
 *   5. Footer links: "Get a server" and "Self-host" (external)
 *
 * @param {{
 *   instanceStates: Map<string, { connectionState: string, handshakeData: object }>,
 *   onCreateServer: () => void,
 *   onBrowseServers: () => void,
 * }} props
 */
import { Flex, Text, Heading, Box, Separator } from '@radix-ui/themes';
import { PlusIcon, GlobeIcon, RocketIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { Button } from './ui';

export default function EmptyState({ instanceStates, onCreateServer, onBrowseServers }) {
  const canCreateServer = _canCreateServer(instanceStates);

  return (
    <Box className="empty-container" data-testid="empty-state">
      <Flex direction="column" align="center" justify="center" gap="4">
        <Box className="empty-icon">
          <RocketIcon width="32" height="32" aria-hidden="true" />
        </Box>

        <Heading as="h2" size="5" align="center" className="empty-heading">
          Welcome to hush
        </Heading>

        <Text size="2" color="gray" align="center" className="empty-description">
          Your private space for encrypted screen sharing and chat.
          No servers here yet — find one below or get your own.
        </Text>

        <Button
          variant="primary"
          className="empty-btn"
          onClick={onCreateServer}
          disabled={!canCreateServer}
        >
          <PlusIcon width="16" height="16" aria-hidden="true" />
          Create a server
        </Button>

        {!canCreateServer && (
          <Text size="1" color="red" align="center" data-testid="creation-blocked-text">
            Server creation is not available on this instance
          </Text>
        )}

        <Button
          variant="secondary"
          className="empty-btn"
          onClick={onBrowseServers}
        >
          <GlobeIcon width="16" height="16" aria-hidden="true" />
          Browse public servers
        </Button>

        <Text size="1" color="gray" align="center" className="empty-invite-hint">
          Have an invite link? Just click it — you&apos;ll be connected automatically.
        </Text>

        <Separator size="1" className="empty-separator" />

        <Flex align="center" justify="center" gap="2">
          <a
            href="https://gethush.live"
            target="_blank"
            rel="noopener noreferrer"
            className="empty-footer-link"
          >
            <ExternalLinkIcon width="12" height="12" aria-hidden="true" />
            Get a server
          </a>
          <Text size="1" color="gray" aria-hidden="true">
            &middot;
          </Text>
          <a
            href="https://gethush.live/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="empty-footer-link"
          >
            <ExternalLinkIcon width="12" height="12" aria-hidden="true" />
            Self-host
          </a>
        </Flex>
      </Flex>
    </Box>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Policies that permit the welcome empty-state to expose server creation. */
const CREATION_ALLOWED_POLICIES = new Set(['open']);

/**
 * Returns true if at least one connected instance allows server creation
 * by regular members.
 *
 * @param {Map<string, object>} instanceStates
 * @returns {boolean}
 */
function _canCreateServer(instanceStates) {
  for (const state of instanceStates.values()) {
    if (state?.connectionState !== 'connected') continue;
    const policy = state?.handshakeData?.server_creation_policy;
    if (CREATION_ALLOWED_POLICIES.has(policy)) return true;
  }
  return false;
}
