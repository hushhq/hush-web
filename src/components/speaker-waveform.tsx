import * as React from "react"
import WaveSurfer from "wavesurfer.js"

let cachedAudioUrl: string | null = null

function buildMockSpeakerAudioUrl(): string {
  if (cachedAudioUrl) return cachedAudioUrl
  const sampleRate = 8000
  const duration = 1.5
  const length = sampleRate * duration
  const buffer = new Float32Array(length)
  for (let i = 0; i < length; i += 1) {
    const t = i / sampleRate
    const envelope = 0.4 + 0.6 * Math.abs(Math.sin(t * 6.0))
    buffer[i] = envelope * (Math.random() * 2 - 1)
  }
  const wav = encodeWav(buffer, sampleRate)
  cachedAudioUrl = URL.createObjectURL(
    new Blob([wav], { type: "audio/wav" })
  )
  return cachedAudioUrl
}

function encodeWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const bytesPerSample = 2
  const byteLength = 44 + samples.length * bytesPerSample
  const buffer = new ArrayBuffer(byteLength)
  const view = new DataView(buffer)
  function writeStr(offset: number, str: string) {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i))
    }
  }
  writeStr(0, "RIFF")
  view.setUint32(4, 36 + samples.length * bytesPerSample, true)
  writeStr(8, "WAVE")
  writeStr(12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * bytesPerSample, true)
  view.setUint16(32, bytesPerSample, true)
  view.setUint16(34, 16, true)
  writeStr(36, "data")
  view.setUint32(40, samples.length * bytesPerSample, true)
  let offset = 44
  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, clamped * 0x7fff, true)
    offset += bytesPerSample
  }
  return buffer
}

interface SpeakerWaveformProps {
  width?: number
  height?: number
}

export function SpeakerWaveform({
  width = 36,
  height = 14,
}: SpeakerWaveformProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const wavesurferRef = React.useRef<WaveSurfer | null>(null)

  React.useEffect(() => {
    if (!containerRef.current) return
    const accent = getCssVar("--primary") || "#0ea5e9"
    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: buildMockSpeakerAudioUrl(),
      waveColor: accent,
      progressColor: accent,
      cursorColor: "transparent",
      height,
      barWidth: 2,
      barGap: 1,
      barRadius: 1,
      interact: false,
      normalize: true,
    })
    wavesurferRef.current = ws

    const handleReady = () => {
      ws.setVolume(0)
      ws.setOptions({ autoplay: true })
      ws.play().catch(() => {})
      ws.on("finish", () => {
        ws.play().catch(() => {})
      })
    }
    ws.on("ready", handleReady)

    return () => {
      ws.destroy()
      wavesurferRef.current = null
    }
  }, [height])

  return (
    <span
      ref={containerRef}
      aria-hidden
      style={{ width, height, display: "inline-block" }}
    />
  )
}

function getCssVar(name: string): string {
  if (typeof window === "undefined") return ""
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    ""
  )
}
