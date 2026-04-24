import { useState, useRef, useEffect } from 'react';
import { Flex, Text, Heading, Box, Separator } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { IconButton } from './ui';
import { searchUsersForDM, createOrFindDM } from '../lib/api';

/**
 * Full-height DM conversation list with search.
 * Replaces the channel sidebar when DM mode is active.
 */
export default function DmListView({ dmGuilds, onSelectDm, getToken, instanceUrl }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [dmError, setDmError] = useState('');
  const searchTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(searchTimerRef.current), []);

  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setDmError('');
    clearTimeout(searchTimerRef.current);
    if (!q.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const token = getToken?.();
        if (!token) return;
        const results = await searchUsersForDM(token, q.trim(), instanceUrl ?? '');
        setSearchResults(Array.isArray(results) ? results : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectUser = async (user) => {
    setDmError('');
    try {
      const token = getToken?.();
      if (!token) return;
      const resp = await createOrFindDM(token, user.id, instanceUrl ?? '');
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      // Server returns { server, otherUser, channelId } — normalize to a guild-like object.
      // Include instanceUrl so handleDmSelect can refresh the correct instance for new DMs.
      if (resp?.server?.id) {
        const guild = { ...resp.server, channelId: resp.channelId };
        if (instanceUrl) guild.instanceUrl = instanceUrl;
        onSelectDm?.(guild);
      }
    } catch (err) {
      console.error('[DmListView] createOrFindDM failed:', err);
      setDmError('Could not start conversation. Please try again.');
    }
  };

  return (
    <Flex direction="column" className="dm-list-view">
      <Flex justify="between" align="center" className="dm-list-header">
        <Heading as="h3" size="3" className="dm-list-title">
          Direct Messages
        </Heading>
        <IconButton
          aria-label="New message"
          className="dm-list-new-icon-btn"
          onClick={() => setShowSearch((v) => !v)}
        >
          <PlusIcon width="16" height="16" aria-hidden="true" />
        </IconButton>
      </Flex>

      <Separator size="1" />

      {showSearch && (
        <Box className="dm-list-search">
          <input
            autoFocus
            type="text"
            placeholder="Find a user..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSearch(false);
                setSearchQuery('');
                setSearchResults([]);
                setDmError('');
              }
            }}
            className="dm-list-search-input"
          />
          {dmError && (
            <Text size="1" color="red" className="dm-list-error">
              {dmError}
            </Text>
          )}
          {(searchResults.length > 0 || searching) && (
            <Box className="dm-list-search-results">
              {searching && (
                <Text size="1" color="gray" className="dm-list-search-status">
                  Searching...
                </Text>
              )}
              {searchResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="dm-list-search-item"
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="dm-list-avatar">
                    {(user.displayName || user.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <Text size="2">{user.displayName || user.username}</Text>
                </button>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Box className="dm-list-conversations">
        {dmGuilds.length === 0 ? (
          <Text size="2" color="gray" align="center" className="dm-list-empty">
            No conversations yet
          </Text>
        ) : (
          dmGuilds.map((guild) => {
            const displayName = guild.otherUser?.displayName
              || guild.otherUser?.username
              || 'Direct Message';
            const initial = displayName.charAt(0).toUpperCase();
            const unread = guild.channels?.[0]?.unreadCount ?? 0;

            return (
              <button
                key={guild.id}
                type="button"
                className={`dm-list-item${unread > 0 ? ' dm-list-item--unread' : ''}`}
                onClick={() => onSelectDm?.(guild)}
              >
                <div className="dm-list-avatar">{initial}</div>
                <span className="dm-list-item-name">{displayName}</span>
                {unread > 0 && (
                  <span className="dm-list-item-badge">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>
            );
          })
        )}
      </Box>
    </Flex>
  );
}
