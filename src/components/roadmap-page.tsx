import * as React from "react"
import { ArrowLeftIcon, CheckIcon, ClockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Timeline } from "@/components/ui/timeline"
import { cn } from "@/lib/utils"
import {
  milestones,
  releasesForMilestone,
  type Milestone,
  type MilestoneStatus,
  type Release,
} from "@/data/changelog"

interface RoadmapPageProps {
  onBack: () => void
}

const STATUS_COPY: Record<MilestoneStatus, string> = {
  done: "Shipped",
  active: "In progress",
  planned: "Planned",
  future: "Future",
}

const STATUS_BADGE: Record<MilestoneStatus, string> = {
  done: "border-success/40 bg-success/10 text-success",
  active: "border-primary/40 bg-primary/10 text-primary",
  planned: "border-muted-foreground/30 bg-muted/40 text-muted-foreground",
  future: "border-border bg-muted/30 text-muted-foreground",
}

export function RoadmapPage({ onBack }: RoadmapPageProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Newest on top: reverse chronological (G → A)
  const sorted = React.useMemo(() => [...milestones].reverse(), [])

  const data = sorted.map((milestone) => ({
    title: milestone.id,
    content: <MilestoneCard milestone={milestone} />,
  }))

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 overflow-y-auto bg-background"
    >
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon />
            Back
          </Button>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-5"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Roadmap
            </span>
            <span className="text-sm font-semibold">
              What we&apos;re building
            </span>
          </div>
        </div>
      </header>
      <Timeline data={data} scrollContainer={scrollRef} />
    </div>
  )
}

function MilestoneCard({ milestone }: { milestone: Milestone }) {
  const releases = releasesForMilestone(milestone.id)
  const statusLabel = STATUS_COPY[milestone.status]
  const statusClass = STATUS_BADGE[milestone.status]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              statusClass
            )}
          >
            {milestone.status === "done" ? (
              <CheckIcon className="size-3" />
            ) : milestone.status === "active" ? (
              <ClockIcon className="size-3" />
            ) : null}
            {statusLabel}
          </span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {milestone.title}
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          {milestone.summary}
        </p>
      </div>

      {releases.length > 0 ? (
        <div className="flex flex-col gap-3">
          {releases.map((release) => (
            <ReleaseCard key={release.version} release={release} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ReleaseCard({ release }: { release: Release }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">
            {release.version}
          </span>
          {release.current ? (
            <Badge variant="secondary" className="text-[10px]">
              current
            </Badge>
          ) : null}
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(release.date)}
        </span>
      </div>
      <h3 className="text-sm font-medium lowercase">— {release.title}</h3>
      <Separator className="my-3" />
      <div className="flex flex-col gap-3">
        {release.groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}
            </span>
            <ul className="flex flex-col gap-1">
              {group.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ]
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}
