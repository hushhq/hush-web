import * as React from "react"
import { toast } from "sonner"

import { useTextChannelMLSCommitListener } from "@/hooks/useTextChannelMLSCommitListener"
import { useTransparencyVerification } from "@/hooks/useTransparencyVerification"

interface WsClientLike {
  on: (event: string, handler: (msg: unknown) => void) => void
  off?: (event: string, handler: (msg: unknown) => void) => void
}

interface InstanceDescriptor {
  instanceUrl: string
  wsClient: WsClientLike
  token: string
  userId: string
  handshakeData: { log_public_key?: string } | null
}

interface PerInstanceListenersProps {
  instance: InstanceDescriptor
  identityPublicKey: Uint8Array | null
  setTransparencyError: (msg: string | null) => void
  /** Fired when the server bans the user account on this instance.
   *  Caller decides logout + redirect; this shell only delivers the
   *  reason. */
  onInstanceBanned: (instanceUrl: string, reason: string) => void
}

/**
 * Mounts every per-instance realtime listener that must run for
 * each connected instance, regardless of which one is in the
 * active view:
 *   - mls.commit + mls.add_request (text channels) — on this
 *     instance's wsClient. Channel-room delivery is owned by the
 *     per-server shell below.
 *   - transparency.key_change re-verify — each instance has its
 *     own log + log public key.
 *   - instance_banned — without per-instance mounting, a kick
 *     from instance B would be invisible while the user views
 *     instance A.
 *
 * Renders nothing (`null`); pure side-effect host so
 * authenticated-app stays declarative.
 */
export function PerInstanceListeners({
  instance,
  identityPublicKey,
  setTransparencyError,
  onInstanceBanned,
}: PerInstanceListenersProps) {
  const { wsClient, instanceUrl, token, userId, handshakeData } = instance

  const getToken = React.useCallback(() => token, [token])

  useTextChannelMLSCommitListener({
    wsClient: wsClient as Parameters<
      typeof useTextChannelMLSCommitListener
    >[0]["wsClient"],
    currentUserId: userId,
    getToken,
    baseUrl: instanceUrl,
  })

  useTransparencyVerification({
    wsClient: wsClient as Parameters<
      typeof useTransparencyVerification
    >[0]["wsClient"],
    instanceUrl,
    token,
    identityPublicKey,
    logPublicKeyHex: handshakeData?.log_public_key ?? null,
    onVerificationFailure: setTransparencyError,
  })

  React.useEffect(() => {
    const handler = (raw: unknown) => {
      const data = raw as { reason?: string }
      const reason = data?.reason || "Your account has been suspended."
      toast.error(`Account suspended: ${reason}`)
      onInstanceBanned(instanceUrl, reason)
    }
    wsClient.on("instance_banned", handler)
    return () => {
      wsClient.off?.("instance_banned", handler)
    }
  }, [wsClient, instanceUrl, onInstanceBanned])

  return null
}
