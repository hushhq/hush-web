import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon, MonitorSmartphoneIcon } from "lucide-react"

import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/contexts/AuthContext"
import { listDeviceKeys, revokeDeviceKey } from "@/lib/api"
import { getReadableDeviceLabel } from "@/lib/deviceLabel"
import { getDeviceId } from "@/hooks/useAuth"
import { TransparencyVerifier } from "@/lib/transparencyVerifier"
import { bytesToHex } from "@/lib/identityVault"
import ApproveDeviceLinkFlow from "@/components/devices/ApproveDeviceLinkFlow.jsx"

interface DeviceRow {
  id: string
  deviceId: string
  label?: string | null
  certifiedAt: string
  lastSeen?: string | null
}

interface DevicesPanelProps {
  /**
   * URL of the auth (home) instance — the one that issued the token and
   * stores the user's device list. NOT the currently-selected server's
   * instance, which may be a federated peer.
   */
  homeInstanceUrl?: string | null
  /**
   * Hex-encoded transparency log public key for the auth instance.
   * Required for post-revoke own-key reverify. When absent, the revoke
   * still succeeds; the verify step is skipped and a console warning
   * surfaces the gap.
   */
  homeLogPublicKey?: string | null
  /**
   * Closes the parent settings dialog. Used by the embedded approve
   * flow when the vault is locked: the panel cannot host the unlock
   * UI, so it closes the dialog and lets the app shell route the
   * user to vault unlock.
   */
  onRequestClose?: () => void
}

export function DevicesPanel({
  homeInstanceUrl,
  homeLogPublicKey,
  onRequestClose,
}: DevicesPanelProps) {
  const [view, setView] = React.useState<"list" | "approve">("list")
  const navigate = useNavigate()
  const { token, identityKeyRef, setTransparencyError } = useAuth() as {
    token: string | null
    identityKeyRef: React.MutableRefObject<{ publicKey: Uint8Array } | null>
    setTransparencyError?: (err: unknown) => void
  }

  const [devices, setDevices] = React.useState<DeviceRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [confirmRevoke, setConfirmRevoke] = React.useState<{
    deviceId: string
    label: string
  } | null>(null)
  const [revoking, setRevoking] = React.useState(false)

  const currentDeviceId = React.useMemo(() => getDeviceId(), [])

  const fetchDevices = React.useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      setError(null)
      // listDeviceKeys' JSDoc shape is stale; backend returns
      // { id, deviceId, label, certifiedAt, lastSeen }.
      const data = (await listDeviceKeys(
        token,
        homeInstanceUrl ?? ""
      )) as unknown as DeviceRow[]
      setDevices(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load devices")
    } finally {
      setLoading(false)
    }
  }, [token, homeInstanceUrl])

  React.useEffect(() => {
    fetchDevices()
  }, [fetchDevices])

  const verifyTransparencyAfterOp = React.useCallback(
    async (opName: string) => {
      if (!homeLogPublicKey || !homeInstanceUrl) {
        // Gap: settings opened before the home instance hydrated. Revoke
        // already landed on the server; periodic verify will catch any
        // log inconsistency on the next pass.
        console.warn(
          `[transparency] post-${opName} verify skipped — home instance state unavailable`
        )
        return
      }
      const pubKey = identityKeyRef.current?.publicKey
      if (!pubKey || !token) return
      try {
        const verifier = new TransparencyVerifier(
          homeInstanceUrl,
          homeLogPublicKey
        )
        const result = (await verifier.verifyOwnKey(
          bytesToHex(pubKey),
          token
        )) as { ok: boolean; error?: unknown }
        if (!result.ok) {
          console.error(
            `[transparency] ${opName} was NOT logged correctly`
          )
          setTransparencyError?.(result.error)
        }
      } catch (err) {
        console.warn(`[transparency] post-${opName} verification failed:`, err)
      }
    },
    [homeInstanceUrl, homeLogPublicKey, identityKeyRef, token, setTransparencyError]
  )

  const handleRevoke = React.useCallback(async () => {
    if (!confirmRevoke || !token) return
    setRevoking(true)
    try {
      await revokeDeviceKey(
        token,
        confirmRevoke.deviceId,
        homeInstanceUrl ?? ""
      )
      await verifyTransparencyAfterOp("device_revoke")
      setConfirmRevoke(null)
      await fetchDevices()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke device")
    } finally {
      setRevoking(false)
    }
  }, [
    confirmRevoke,
    token,
    fetchDevices,
    verifyTransparencyAfterOp,
    homeInstanceUrl,
  ])

  if (view === "approve") {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setView("list")
              fetchDevices()
            }}
          >
            <ArrowLeftIcon />
            Back to devices
          </Button>
        </div>
        <ApproveDeviceLinkFlow
          mode="embedded"
          initialPayload={null}
          onCancel={() => {
            setView("list")
            fetchDevices()
          }}
          onSuccess={() => {
            // Stay on the approve view so the success toast is visible;
            // the user can use Back to return to the list, which
            // refetches.
          }}
          onVaultUnlockNeeded={() => {
            onRequestClose?.()
            navigate("/")
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Devices</h2>
        <p className="text-sm text-muted-foreground">
          On the new device, open <strong>Link to existing device</strong>{" "}
          from the sign-in screen to show its QR code or fallback code. Use
          this page on your current signed-in device to scan that QR code or
          enter that fallback code and approve the link.
        </p>
      </div>

      <Separator />

      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading devices…</p>
      ) : devices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No devices registered.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Device</th>
                <th className="px-3 py-2 text-left font-medium">Last active</th>
                <th className="px-3 py-2 text-left font-medium">Linked</th>
                <th className="px-3 py-2 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => {
                const isCurrent = device.deviceId === currentDeviceId
                const displayLabel = getDeviceDisplayLabel(device, isCurrent)
                const staleness = getDeviceStaleness(device.lastSeen)
                return (
                  <tr
                    key={device.deviceId}
                    className="border-t first:border-t-0"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{displayLabel}</span>
                        {isCurrent ? (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            This device
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div>{formatRelativeTime(device.lastSeen)}</div>
                      {staleness === "critical" ? (
                        <div className="mt-0.5 text-xs text-destructive">
                          Inactive 90+ days — consider revoking
                        </div>
                      ) : staleness === "warning" ? (
                        <div className="mt-0.5 text-xs text-amber-500">
                          Inactive 30+ days
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 align-top text-muted-foreground">
                      {device.certifiedAt
                        ? new Date(device.certifiedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 align-top text-right">
                      {!isCurrent ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setConfirmRevoke({
                              deviceId: device.deviceId,
                              label: displayLabel,
                            })
                          }
                        >
                          Revoke
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <Button variant="secondary" onClick={() => setView("approve")}>
          <MonitorSmartphoneIcon />
          Link a new device
        </Button>
      </div>

      <AlertDialog
        open={confirmRevoke !== null}
        onOpenChange={(open) => {
          if (!open && !revoking) setConfirmRevoke(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke device?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove <strong>{confirmRevoke?.label}</strong> from your account.
              It will no longer be able to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                void handleRevoke()
              }}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revoking ? "Revoking…" : "Revoke device"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "Never"
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function getDeviceStaleness(
  lastSeen?: string | null
): "warning" | "critical" | null {
  if (!lastSeen) return null
  const days = Math.floor(
    (Date.now() - new Date(lastSeen).getTime()) / 86400000
  )
  if (days >= 90) return "critical"
  if (days >= 30) return "warning"
  return null
}

function getDeviceDisplayLabel(device: DeviceRow, isCurrent: boolean): string {
  if (device.label) return device.label
  if (isCurrent) return getReadableDeviceLabel()
  // Devices registered before the label-on-certify wiring landed
  // surface their raw deviceId hash (~64 chars), which is unreadable.
  // Fall back to a short identifier so the row is still
  // distinguishable from siblings without exposing the full hash.
  if (device.deviceId) {
    return `Unknown device (${device.deviceId.slice(0, 8)})`
  }
  return "Unknown device"
}
