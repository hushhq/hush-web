import { Flex, Box } from '@radix-ui/themes';

/**
 * Desktop three-column layout shell.
 * Server strip is rendered by the parent; this component owns the
 * unified main panel (channel sidebar + resize handle + content area).
 */
export default function DesktopShell({
  serverListEl,
  channelSidebarEl,
  sidebarWidth,
  onSidebarResize,
  children,
}) {
  return (
    <>
      {serverListEl}
      <Flex className="lay-main" direction="column" flexGrow="1" overflow="hidden">
        <Flex
          className="lay-content-row"
          direction="row"
          flexGrow="1"
          overflow="hidden"
          position="relative"
          minWidth="0"
        >
          <Flex style={{ width: sidebarWidth }} shrink="0" position="relative">
            {channelSidebarEl}
            <Box
              className="lay-resize-handle"
              onMouseDown={onSidebarResize}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize channel list"
            />
          </Flex>
          <Flex className="lay-channel-area" direction="column" flexGrow="1" overflow="hidden" position="relative">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
