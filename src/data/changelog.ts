export type MilestoneStatus = "done" | "active" | "planned" | "future"

export interface Milestone {
  id: string
  title: string
  status: MilestoneStatus
  summary: string
}

export interface ReleaseGroup {
  label: string
  items: string[]
}

export interface Release {
  version: string
  date: string
  milestone: string
  title: string
  current?: boolean
  tags: string[]
  groups: ReleaseGroup[]
}

export const milestones: Milestone[] = [
  {
    id: "A",
    title: "Foundation",
    status: "done",
    summary:
      "Core prototype: auth, persistent chat, voice and video rooms.",
  },
  {
    id: "B",
    title: "End-to-End Encryption",
    status: "done",
    summary:
      "E2EE on everything: chat messages, voice, video, and screen sharing.",
  },
  {
    id: "C",
    title: "Signal Protocol + Go Backend",
    status: "done",
    summary:
      "Go backend with Signal Protocol (X3DH + Double Ratchet) via hush-crypto WASM. Matrix fully removed.",
  },
  {
    id: "D",
    title: "Servers & Channels",
    status: "active",
    summary:
      "Discord-like community structure. Servers, text and voice channels, categories, invites, drag-and-drop reordering.",
  },
  {
    id: "E",
    title: "Production & Launch",
    status: "planned",
    summary:
      "Moderation tools, rate limiting, security hardening. Self-hosting in under 10 minutes.",
  },
  {
    id: "F",
    title: "Desktop & Mobile",
    status: "future",
    summary: "Native apps with the same E2EE guarantees.",
  },
  {
    id: "G",
    title: "Key Backup & Multi-Device",
    status: "future",
    summary:
      "Losing a device no longer means losing chat history.",
  },
]

export const releases: Release[] = [
  {
    version: "0.7.0-alpha",
    date: "2026-03-03",
    milestone: "D",
    title: "core rewrite",
    current: true,
    tags: ["release", "architecture"],
    groups: [
      {
        label: "architecture",
        items: [
          "Go backend replacing Node.js/Matrix for auth, API, and WebSocket presence",
          "Signal Protocol (X3DH + Double Ratchet) via hush-crypto Rust crate compiled to WASM",
          "WebSocket message routing with per-recipient fan-out encryption",
          "LiveKit E2EE key distribution via Signal sessions",
          "Encrypted message store in IndexedDB with per-session crypto keys",
        ],
      },
      {
        label: "features",
        items: [
          "Server-scoped membership and invites",
          "Drag-and-drop channel and category reordering",
          "Pinned messages popover with jump-to-message",
          "Mentions and unread indicators",
        ],
      },
    ],
  },
  {
    version: "0.6.0",
    date: "2026-01-18",
    milestone: "C",
    title: "matrix sunset",
    tags: ["release"],
    groups: [
      {
        label: "removed",
        items: [
          "Matrix/Synapse runtime, dependencies, and persistence",
          "Element-derived UI components",
        ],
      },
      {
        label: "added",
        items: [
          "Signal Protocol session establishment via X3DH",
          "Encrypted chat history sync between devices",
        ],
      },
    ],
  },
  {
    version: "0.5.0",
    date: "2025-11-12",
    milestone: "B",
    title: "voice + video E2EE",
    tags: ["release", "security"],
    groups: [
      {
        label: "added",
        items: [
          "End-to-end encryption for LiveKit rooms",
          "Per-room key rotation on participant join/leave",
          "Screen sharing E2EE with frame-level encryption",
        ],
      },
    ],
  },
  {
    version: "0.4.0",
    date: "2025-08-22",
    milestone: "A",
    title: "rooms",
    tags: ["release"],
    groups: [
      {
        label: "added",
        items: [
          "Voice rooms via LiveKit",
          "Video and screen sharing in voice rooms",
          "Push-to-talk and noise suppression",
        ],
      },
    ],
  },
]

export function releasesForMilestone(milestoneId: string): Release[] {
  return releases.filter((r) => r.milestone === milestoneId)
}
