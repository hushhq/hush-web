import { Flex } from '@radix-ui/themes';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { IconButton, Button } from '../../components/ui';

/**
 * Header row shown in the channel content area when no channel is selected.
 *
 * On mobile: shows a hamburger toggle for the left drawer and a Members
 * toggle for the right sidebar.
 *
 * On desktop: shows only the Members toggle (left slot is empty).
 */
export default function ChannelAreaHeader({
  isMobile,
  onToggleDrawer,
  onToggleMembers,
  showMembers,
}) {
  return (
    <Flex className="lay-channel-area-header" align="center" justify="between">
      {isMobile ? (
        <IconButton
          onClick={onToggleDrawer}
          aria-label="Toggle channels"
          title="Toggle channels"
        >
          <HamburgerMenuIcon width="20" height="20" aria-hidden="true" />
        </IconButton>
      ) : (
        <div />
      )}
      <Button
        variant="secondary"
        onClick={onToggleMembers}
        aria-pressed={showMembers}
      >
        Members
      </Button>
    </Flex>
  );
}
