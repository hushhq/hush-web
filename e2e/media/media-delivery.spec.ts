/**
 * media-delivery.spec.ts
 *
 * Symmetric two-client audio smoke test. Proves that two real Chromium
 * contexts, joined to the same voice channel through the real hush-server and
 * real LiveKit, actually exchange audio and that FrameCryptor E2EE decryption
 * succeeds (decryptFailures === 0) with the media key bound to the current MLS
 * epoch.
 *
 * Covers CORE-INVARIANTS: voice, MLS.
 *
 * Run: npm run e2e:media
 */

import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import {
  createEphemeralSession,
  seedVoiceChannel,
  injectSession,
  injectVoicePrefs,
} from './fixtures/session.js';
import { PREVIEW_URL, SERVER_URL } from './constants.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INSTANCE_HOST = new URL(SERVER_URL).host; // e.g. "127.0.0.1:8080"

// Timeouts
const MLS_PROVISION_TIMEOUT_MS = 20_000;
const VOICE_JOIN_TIMEOUT_MS = 45_000;
const STATS_SAMPLE_GAP_MS = 800;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build the in-app URL for a voice channel.
 *
 * URL pattern: /{instanceHost}/{guildSlug}/{channelId}
 * guildSlug mirrors buildGuildRouteRef("e2e", serverId) in slugify.js:
 *   slugify("e2e") = "e2e", separator = "--", result = "e2e--{serverId}"
 */
function voiceChannelUrl(serverId: string, channelId: string): string {
  return `${PREVIEW_URL}/${INSTANCE_HOST}/e2e--${serverId}/${channelId}`;
}

interface AudioStats {
  bytesReceived: number;
  packetsReceived: number;
}

/**
 * Reads cumulative inbound-rtp audio stats from the LiveKit subscriber
 * PeerConnection. Accesses room.engine.subscriber.pc which is an internal
 * but runtime-accessible field on LiveKit 2.x Room objects.
 *
 * Returns null when the room or PeerConnection is not yet available.
 */
async function sampleAudioStats(page: Page): Promise<AudioStats | null> {
  return page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const room = (window as any).__hushRoom;
    if (!room) return null;

    // Traverse LiveKit internals: Room -> RTCEngine -> PCTransport -> RTCPeerConnection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pc: RTCPeerConnection | undefined = (room as any).engine?.subscriber?.pc;
    if (!pc) return null;

    const report = await pc.getStats();
    let bytesReceived = 0;
    let packetsReceived = 0;
    report.forEach((stat) => {
      if (
        stat.type === 'inbound-rtp' &&
        (stat as RTCInboundRtpStreamStats).kind === 'audio'
      ) {
        bytesReceived += (stat as RTCInboundRtpStreamStats).bytesReceived ?? 0;
        packetsReceived +=
          (stat as RTCInboundRtpStreamStats).packetsReceived ?? 0;
      }
    });
    return { bytesReceived, packetsReceived };
  });
}

interface E2eeStats {
  decryptFailures: number;
  mediaKeyEpoch: number;
  keyIndex: number;
  lastError: string | null;
}

/**
 * Reads window.__hushE2eeStats from the page.
 * Returns null when the diagnostic surface has not been installed.
 */
async function readE2eeStats(page: Page): Promise<E2eeStats | null> {
  return page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stats = (window as any).__hushE2eeStats;
    if (!stats) return null;
    return {
      decryptFailures: stats.decryptFailures,
      mediaKeyEpoch: stats.mediaKeyEpoch,
      keyIndex: stats.keyIndex,
      lastError: stats.lastError,
    };
  });
}

/**
 * Returns the count of remote participants visible in the LiveKit room.
 */
async function remoteParticipantCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const room = (window as any).__hushRoom;
    return room?.remoteParticipants?.size ?? 0;
  });
}

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

test.describe('media delivery: audio + E2EE', () => {
  test(
    'both clients exchange audio and FrameCryptor E2EE succeeds',
    async ({ browser }) => {
      // ── Step 1: Provision identities and seed voice channel ─────────────────

      const [sessionA, sessionB] = await Promise.all([
        createEphemeralSession(),
        createEphemeralSession(),
      ]);

      const { serverId, channelId } = await seedVoiceChannel([
        sessionA.userId,
        sessionB.userId,
      ]);

      const channelUrl = voiceChannelUrl(serverId, channelId);

      // ── Step 2: Set up two isolated browser contexts ─────────────────────────

      const ctxA = await browser.newContext({ permissions: ['microphone'] });
      const ctxB = await browser.newContext({ permissions: ['microphone'] });

      try {
        // Inject auth storage (fires on every navigation in the context).
        await injectSession(ctxA, sessionA);
        await injectSession(ctxB, sessionB);

        // Inject voice prefs: dontAskAgain=true skips the prejoin dialog so
        // VoiceChannelView auto-connects; audioEnabled=true publishes mic on join.
        await injectVoicePrefs(ctxA, sessionA.userId, SERVER_URL);
        await injectVoicePrefs(ctxB, sessionB.userId, SERVER_URL);

        const pageA = await ctxA.newPage();
        const pageB = await ctxB.newPage();

        // ── Step 3: Boot app, provision MLS credentials ────────────────────────
        //
        // The no-vault AUTHORIZED boot path skips uploadKeyPackagesAfterAuth.
        // window.__hushProvisionMls (gated on VITE_E2E_DIAG=1, set by useAuth.js)
        // calls it on demand so the MLS credential exists in IDB before voice join.

        await Promise.all([
          pageA.goto(PREVIEW_URL),
          pageB.goto(PREVIEW_URL),
        ]);

        // Wait for useAuth to settle into the authenticated+no-vault state and
        // expose the provision helper.
        await Promise.all([
          pageA.waitForFunction(
            () => typeof (window as any).__hushProvisionMls === 'function',
            { timeout: MLS_PROVISION_TIMEOUT_MS },
          ),
          pageB.waitForFunction(
            () => typeof (window as any).__hushProvisionMls === 'function',
            { timeout: MLS_PROVISION_TIMEOUT_MS },
          ),
        ]);

        // Generate MLS credential + upload key packages for each client.
        // The credential is stored in IndexedDB and persists across navigation.
        await Promise.all([
          pageA.evaluate(() => (window as any).__hushProvisionMls()),
          pageB.evaluate(() => (window as any).__hushProvisionMls()),
        ]);

        // ── Step 4: Navigate to voice channel ─────────────────────────────────
        //
        // dontAskAgain=true in voice prefs causes VoiceChannelView to
        // auto-call connectRoom() without showing the prejoin dialog. The
        // MLS credential now in IDB enables createVoiceGroup/joinVoiceGroup.

        await Promise.all([
          pageA.goto(channelUrl),
          pageB.goto(channelUrl),
        ]);

        // ── Step 5: Wait for both clients to see each other ───────────────────

        await Promise.all([
          pageA.waitForFunction(
            (count) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return ((window as any).__hushRoom?.remoteParticipants?.size ?? 0) >= count;
            },
            1,
            { timeout: VOICE_JOIN_TIMEOUT_MS },
          ),
          pageB.waitForFunction(
            (count) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return ((window as any).__hushRoom?.remoteParticipants?.size ?? 0) >= count;
            },
            1,
            { timeout: VOICE_JOIN_TIMEOUT_MS },
          ),
        ]);

        // ── Step 6: Delta-based audio liveness assertion ──────────────────────
        //
        // Two samples ~800ms apart. Positive delta on bytesReceived proves
        // audio is flowing (not just a one-time header frame).

        const [s1A, s1B] = await Promise.all([
          sampleAudioStats(pageA),
          sampleAudioStats(pageB),
        ]);

        await new Promise((r) => setTimeout(r, STATS_SAMPLE_GAP_MS));

        const [s2A, s2B] = await Promise.all([
          sampleAudioStats(pageA),
          sampleAudioStats(pageB),
        ]);

        // Fail loud with useful context if stats are unavailable.
        expect(s1A, 'pageA: audio stats sample 1 unavailable (room or PC not ready)').not.toBeNull();
        expect(s1B, 'pageB: audio stats sample 1 unavailable').not.toBeNull();
        expect(s2A, 'pageA: audio stats sample 2 unavailable').not.toBeNull();
        expect(s2B, 'pageB: audio stats sample 2 unavailable').not.toBeNull();

        const deltaA = s2A!.bytesReceived - s1A!.bytesReceived;
        const deltaB = s2B!.bytesReceived - s1B!.bytesReceived;

        expect(
          deltaA,
          `pageA: no inbound audio bytes in ${STATS_SAMPLE_GAP_MS}ms window (delta=${deltaA})`,
        ).toBeGreaterThan(0);

        expect(
          deltaB,
          `pageB: no inbound audio bytes in ${STATS_SAMPLE_GAP_MS}ms window (delta=${deltaB})`,
        ).toBeGreaterThan(0);

        // ── Step 7: E2EE correctness assertions ───────────────────────────────
        //
        // decryptFailures === 0: FrameCryptor never failed to decrypt a frame.
        // mediaKeyEpoch >= 0: a valid MLS epoch was applied to the key provider.
        // keyIndex === epoch % 256: the AES key slot matches the MLS epoch.

        const [e2eeA, e2eeB] = await Promise.all([
          readE2eeStats(pageA),
          readE2eeStats(pageB),
        ]);

        expect(
          e2eeA,
          'pageA: window.__hushE2eeStats not installed (VITE_E2E_DIAG not set or build flag missing)',
        ).not.toBeNull();
        expect(
          e2eeB,
          'pageB: window.__hushE2eeStats not installed',
        ).not.toBeNull();

        expect(e2eeA!.decryptFailures, 'pageA: FrameCryptor decrypt failures').toBe(0);
        expect(e2eeB!.decryptFailures, 'pageB: FrameCryptor decrypt failures').toBe(0);

        expect(e2eeA!.mediaKeyEpoch, 'pageA: MLS epoch not set').toBeGreaterThanOrEqual(0);
        expect(e2eeB!.mediaKeyEpoch, 'pageB: MLS epoch not set').toBeGreaterThanOrEqual(0);

        expect(
          e2eeA!.keyIndex,
          'pageA: keyIndex !== epoch % 256',
        ).toBe(e2eeA!.mediaKeyEpoch % 256);

        expect(
          e2eeB!.keyIndex,
          'pageB: keyIndex !== epoch % 256',
        ).toBe(e2eeB!.mediaKeyEpoch % 256);

        // Sanity: both clients converged on the same MLS epoch.
        expect(
          e2eeA!.mediaKeyEpoch,
          'clients converged on different MLS epochs',
        ).toBe(e2eeB!.mediaKeyEpoch);

      } finally {
        await ctxA.close().catch(() => {});
        await ctxB.close().catch(() => {});
      }
    },
  );
});
