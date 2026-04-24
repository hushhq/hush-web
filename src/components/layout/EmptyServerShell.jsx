import { Flex, Box } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

/**
 * Empty-state shell shown when the user has no guild selected.
 * Wraps ServerList and the EmptyState surface in a Radix-first layout.
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
    <Flex className="lay-container" direction="row" height="100dvh" overflow="hidden" gap="2" p="3" style={{ overflow: 'hidden' }}>
      {serverListEl}
      <Box flexGrow="1">
        {emptyStateEl}
      </Box>
      {guildCreateModal}
      {hasNoTransparencyLog && authToken && (
        <Box
          className="transp-no-log-badge"
          title="Transparency log not configured - key operations cannot be independently verified"
          aria-label="Transparency log not configured"
        >
          <InfoCircledIcon width="16" height="16" aria-hidden="true" />
        </Box>
      )}
      {toastEl}
    </Flex>
  );
}
