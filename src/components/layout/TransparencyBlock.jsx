import { Flex, Heading, Text } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button } from '../ui';

/**
 * Full-screen transparency hard-fail overlay.
 * Preserves legacy CSS classes for theme tokens while rebuilding structure
 * with Radix Themes primitives.
 */
export default function TransparencyBlock({ error, onSignOut }) {
  return (
    <Flex className="transp-hard-fail-overlay" direction="column" align="center" justify="center">
      <Flex className="transp-hard-fail-card" direction="column" align="center" gap="4">
        <Flex className="transp-hard-fail-icon" align="center" justify="center">
          <ExclamationTriangleIcon width="32" height="32" aria-hidden="true" />
        </Flex>
        <Heading as="h2" size="5" className="transp-hard-fail-heading">
          Key Verification Failed
        </Heading>
        <Text as="p" size="2" className="transp-hard-fail-body">
          {error}
        </Text>
        <Text size="1" color="gray" className="transp-hard-fail-note">
          Your account may be compromised. Do not continue using this session.
          Contact your instance administrator.
        </Text>
        <Button variant="danger" className="transp-hard-fail-btn" onClick={onSignOut}>
          Sign Out
        </Button>
      </Flex>
    </Flex>
  );
}
