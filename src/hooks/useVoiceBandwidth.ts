import * as React from "react"

import {
  estimateUploadSpeed,
  getRecommendedQuality,
} from "@/lib/bandwidthEstimator"
import { DEFAULT_QUALITY, QUALITY_PRESETS } from "@/utils/constants"

type QualityKey = keyof typeof QUALITY_PRESETS

interface UseVoiceBandwidth {
  qualityKey: QualityKey
  setQualityKey: (key: QualityKey) => void
  recommendedQualityKey: QualityKey | null
  recommendedUploadMbps: number | null
}

function isLocalhost(): boolean {
  if (typeof window === "undefined") return false
  const host = window.location.hostname
  return host === "localhost" || host === "127.0.0.1"
}

/**
 * Probes the upload pipe once at mount and exposes the recommended
 * screen-share quality + the live selection. Localhost short-circuits
 * the probe to "source" because the loopback path saturates the
 * heuristic at unrealistic numbers.
 */
export function useVoiceBandwidth(): UseVoiceBandwidth {
  const [qualityKey, setQualityKey] = React.useState<QualityKey>(
    DEFAULT_QUALITY as QualityKey
  )
  const [recommendedQualityKey, setRecommendedQualityKey] =
    React.useState<QualityKey | null>(null)
  const [recommendedUploadMbps, setRecommendedUploadMbps] = React.useState<
    number | null
  >(null)

  React.useEffect(() => {
    let cancelled = false
    if (isLocalhost()) {
      setRecommendedQualityKey("source" as QualityKey)
      setRecommendedUploadMbps(100)
      setQualityKey("source" as QualityKey)
      return
    }
    estimateUploadSpeed()
      .then((speed: number) => {
        if (cancelled) return
        const rec = getRecommendedQuality(speed) as {
          key: QualityKey
          uploadMbps: number
        }
        setRecommendedQualityKey(rec.key)
        setRecommendedUploadMbps(rec.uploadMbps)
        setQualityKey(rec.key)
      })
      .catch(() => {
        // Bandwidth probe is best-effort; default quality remains.
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    qualityKey,
    setQualityKey,
    recommendedQualityKey,
    recommendedUploadMbps,
  }
}
