import { describe, it, expect } from 'vitest';
import {
  buildGuildInviteLink,
  CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE,
  isCrossInstanceInviteLink,
  parseInviteLink,
} from './inviteLinks.js';

describe('parseInviteLink', () => {
  it('parses cross-instance invite: /join/{host}/{code}', () => {
    const result = parseInviteLink('https://app.gethush.live/join/89.167.121.15/AbC12345');
    expect(result).toEqual({ instanceHost: '89.167.121.15', code: 'AbC12345' });
  });

  it('parses cross-instance invite with port', () => {
    const result = parseInviteLink('https://myapp.com/join/chat.example.com:8443/XyZ98765');
    expect(result).toEqual({ instanceHost: 'chat.example.com:8443', code: 'XyZ98765' });
  });

  it('parses same-instance invite: /invite/{code}', () => {
    const result = parseInviteLink('https://chat.example.com/invite/AbC12345');
    expect(result).toEqual({ instanceHost: 'chat.example.com', code: 'AbC12345' });
  });

  it('strips URL fragment (guild name)', () => {
    const result = parseInviteLink('https://app.com/join/89.167.121.15/AbC12345#name=My%20Server');
    expect(result).toEqual({ instanceHost: '89.167.121.15', code: 'AbC12345' });
  });

  it('strips URL fragments that include both guild name and metadata key', () => {
    const result = parseInviteLink('https://app.com/join/89.167.121.15/AbC12345#name=My%20Server&mk=encoded');
    expect(result).toEqual({ instanceHost: '89.167.121.15', code: 'AbC12345' });
  });

  it('handles bare code (no URL)', () => {
    const result = parseInviteLink('AbC12345');
    expect(result).toEqual({ instanceHost: null, code: 'AbC12345' });
  });

  it('returns null for invalid input', () => {
    expect(parseInviteLink('')).toBeNull();
    expect(parseInviteLink('https://example.com/servers/some-id')).toBeNull();
    expect(parseInviteLink('not a link at all with spaces')).toBeNull();
  });

  it('handles IP-based instance URLs', () => {
    const result = parseInviteLink('https://10.0.0.1/join/89.167.121.15/AbC12345');
    expect(result).toEqual({ instanceHost: '89.167.121.15', code: 'AbC12345' });
  });
});

describe('buildGuildInviteLink', () => {
  it('rejects cross-instance invite link generation for MVP', () => {
    expect(() => buildGuildInviteLink(
      'https://app.gethush.live',
      'https://remote.example.com',
      'AbC12345',
      'Secret Guild',
      new Uint8Array(32).fill(1),
    )).toThrow(CROSS_INSTANCE_INVITES_UNSUPPORTED_MESSAGE);
  });

  it('includes the encrypted guild metadata key in same-instance URL fragments when provided', () => {
    const link = buildGuildInviteLink(
      'https://app.gethush.live',
      'https://app.gethush.live',
      'AbC12345',
      'Secret Guild',
      new Uint8Array(32).fill(1),
    );

    expect(link).toContain('/invite/AbC12345');
    expect(link).toContain('#name=');
    expect(link).toContain('&mk=');
  });

  it('builds same-instance invite link without instance host', () => {
    const link = buildGuildInviteLink(
      'https://app.gethush.live',
      null,
      'AbC12345',
      null,
    );

    expect(link).toContain('/invite/AbC12345');
    expect(link).not.toContain('/join/');
  });
});

describe('isCrossInstanceInviteLink', () => {
  it('returns true only when app origin and invite instance differ', () => {
    expect(isCrossInstanceInviteLink('https://app.gethush.live', 'https://remote.example.com')).toBe(true);
    expect(isCrossInstanceInviteLink('https://app.gethush.live', 'https://app.gethush.live')).toBe(false);
    expect(isCrossInstanceInviteLink('https://app.gethush.live', null)).toBe(false);
  });
});
