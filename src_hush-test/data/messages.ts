export interface ThreadSummary {
  count: number
  lastReply: string
  participants: { initials: string }[]
}

export type SampleMessage = {
  id: string
  author: string
  initials: string
  timestamp: string
  body: string
  isMention?: boolean
  date: string
  thread?: ThreadSummary
}

const HUSH_GENERAL: SampleMessage[] = Array.from({ length: 25 }, (_, i) => ({
  id: `h-g-pad-${i}`,
  author: i % 3 === 0 ? "alex" : i % 3 === 1 ? "jamie" : "yarin",
  initials: i % 3 === 0 ? "AL" : i % 3 === 1 ? "JM" : "YC",
  timestamp: `8:${(i + 10).toString().padStart(2, "0")}`,
  body: `padding message ${i + 1} — verifying scroll bounces inside the chat frame`,
  date: "Today",
})).concat([
  {
    id: "h-g-1",
    author: "alex",
    initials: "AL",
    timestamp: "9:14",
    body: "morning team — pushing the auth refactor PR after standup",
    date: "Today",
  },
  {
    id: "h-g-2",
    author: "alex",
    initials: "AL",
    timestamp: "9:15",
    body: "fix preview here:\n\n```ts\nfunction authMiddleware(req: Request) {\n  const token = req.headers.get('authorization')\n  if (!token) throw new HttpError(401, 'missing token')\n  return verify(token, env.JWT_SECRET)\n}\n```",
    date: "Today",
  },
  {
    id: "h-g-3",
    author: "jamie",
    initials: "JM",
    timestamp: "9:18",
    body: "nice. **@yarin** can you take a look once it's up? need eyes on the `rate-limit` branch",
    isMention: true,
    date: "Today",
  },
  {
    id: "h-g-4",
    author: "yarin",
    initials: "YC",
    timestamp: "9:21",
    body: "yep on it. have a few notes from yesterday's spike too — will drop in thread",
    date: "Today",
  },
  {
    id: "h-g-5",
    author: "yarin",
    initials: "YC",
    timestamp: "9:22",
    body: "also: anyone hit issues with `pnpm install` on node 24? getting a peer warning on `@types/react`",
    date: "Today",
  },
  {
    id: "h-g-6",
    author: "alex",
    initials: "AL",
    timestamp: "9:24",
    body: "perfect 🙏",
    date: "Today",
  },
])

const HUSH_RANDOM: SampleMessage[] = [
  {
    id: "h-r-1",
    author: "sasha",
    initials: "SK",
    timestamp: "8:02",
    body: "anyone else seeing CI flake on the e2e suite this morning?",
    date: "Today",
    thread: {
      count: 7,
      lastReply: "12m ago",
      participants: [
        { initials: "MR" },
        { initials: "AL" },
        { initials: "YC" },
      ],
    },
  },
  {
    id: "h-r-2",
    author: "marco",
    initials: "MR",
    timestamp: "8:14",
    body: "yes — looks like a network hiccup with the test container.\n\n```bash\n$ docker logs e2e-runner | tail\nERR_CONNECTION_RESET\n```",
    date: "Today",
  },
  {
    id: "h-r-3",
    author: "sasha",
    initials: "SK",
    timestamp: "8:16",
    body: "thanks. retrying now. fingers crossed 🤞",
    date: "Today",
  },
  {
    id: "h-r-4",
    author: "alex",
    initials: "AL",
    timestamp: "8:34",
    body: "side note: the new shadcn `radix-nova` preset is *insanely* nice. switching everything to it",
    date: "Today",
    thread: {
      count: 3,
      lastReply: "45m ago",
      participants: [{ initials: "YC" }, { initials: "JM" }],
    },
  },
  {
    id: "h-r-5",
    author: "yarin",
    initials: "YC",
    timestamp: "8:42",
    body: "agree. the [Geist font](https://vercel.com/font) + neutral palette is the cleanest combo I've seen",
    date: "Today",
  },
]

const HUSH_ANNOUNCEMENTS: SampleMessage[] = [
  {
    id: "h-a-1",
    author: "yarin",
    initials: "YC",
    timestamp: "Mon",
    body: "**Sprint 12 retro** is Wednesday at 10am UTC. Async notes welcome in the doc — link in pinned.",
    date: "Apr 30",
  },
  {
    id: "h-a-2",
    author: "yarin",
    initials: "YC",
    timestamp: "Mon",
    body: "Reminder: feature freeze for v0.8 lands **Friday EOD**. Hotfixes only after that.",
    date: "Apr 30",
  },
  {
    id: "h-a-3",
    author: "alex",
    initials: "AL",
    timestamp: "Tue",
    body: "v0.7.3 is out. Highlights:\n\n- new sidebar nav with custom rail\n- `⌘K` command palette\n- voice channel UI overhaul\n- 30+ a11y fixes",
    date: "Apr 30",
  },
]

const DESIGN_GENERAL: SampleMessage[] = [
  {
    id: "d-g-1",
    author: "marco",
    initials: "MR",
    timestamp: "10:02",
    body: "pushed the new typography scale exploration to figma. 4 options on the page → 2 are with Geist Variable, 2 are with Inter.",
    date: "Today",
    thread: {
      count: 12,
      lastReply: "5m ago",
      participants: [
        { initials: "LV" },
        { initials: "YC" },
        { initials: "AL" },
        { initials: "JM" },
      ],
    },
  },
  {
    id: "d-g-2",
    author: "lia",
    initials: "LV",
    timestamp: "10:08",
    body: "favorite is option C — the Inter w/ -0.011em letter-spacing on body. feels less robotic",
    date: "Today",
  },
  {
    id: "d-g-3",
    author: "marco",
    initials: "MR",
    timestamp: "10:11",
    body: "agreed but I'd push for Geist on display since it pairs better with the mono. the question is body legibility at 14px",
    date: "Today",
  },
  {
    id: "d-g-4",
    author: "lia",
    initials: "LV",
    timestamp: "10:15",
    body: "let's a/b test internally. I'll set up a tiny preview page",
    date: "Today",
  },
]

const DESIGN_FEEDBACK: SampleMessage[] = [
  {
    id: "d-f-1",
    author: "marco",
    initials: "MR",
    timestamp: "yesterday",
    body: "+1 on the button radius change. Looks much cleaner.",
    date: "Yesterday",
  },
  {
    id: "d-f-2",
    author: "yarin",
    initials: "YC",
    timestamp: "yesterday",
    body: "the new inset frame for the workspace really sells the discord-but-clean vibe. good call",
    date: "Yesterday",
  },
  {
    id: "d-f-3",
    author: "lia",
    initials: "LV",
    timestamp: "9:30",
    body: "small nit: the unread badge on active channel is a bit loud — the *muted gray* version on non-mentions is perfect though",
    date: "Today",
  },
  {
    id: "d-f-4",
    author: "marco",
    initials: "MR",
    timestamp: "9:34",
    body: "we already differentiate mentions vs unread. agree the mention bg could be 1 shade softer",
    date: "Today",
  },
]

const RESEARCH_PAPERS: SampleMessage[] = [
  {
    id: "r-p-1",
    author: "elena",
    initials: "EM",
    timestamp: "Wed",
    body: "interesting paper drop: *On the limits of synthetic data in fine-tuning small models* — [arxiv link](https://arxiv.org/abs/2401.00000). takeaway: signal saturates after ~10k synthetic samples",
    date: "Apr 30",
  },
  {
    id: "r-p-2",
    author: "kenji",
    initials: "KO",
    timestamp: "Thu",
    body: "thanks. their methodology is clean. table 4 is the money chart",
    date: "Apr 30",
  },
  {
    id: "r-p-3",
    author: "elena",
    initials: "EM",
    timestamp: "Thu",
    body: "exactly. let's discuss in **Wednesday's reading group**. I'll prep 5 slides on the eval setup",
    date: "Apr 30",
  },
]

const RESEARCH_EXPERIMENTS: SampleMessage[] = [
  {
    id: "r-e-1",
    author: "kenji",
    initials: "KO",
    timestamp: "11:02",
    body: "experiment 47 done. results below:\n\n```py\n# eval results — exp_47\nbaseline_acc = 0.731\nfine_tuned_acc = 0.802\ndelta = +7.1pp\np_value = 0.003\n```\n\nstat-sig improvement on the held-out set 🎉",
    date: "Today",
  },
  {
    id: "r-e-2",
    author: "elena",
    initials: "EM",
    timestamp: "11:11",
    body: "great. compute cost?",
    date: "Today",
  },
  {
    id: "r-e-3",
    author: "kenji",
    initials: "KO",
    timestamp: "11:13",
    body: "$48 on h100s, 4h wall-clock. cheaper than I thought",
    date: "Today",
  },
]

const DM_ALEX: SampleMessage[] = [
  {
    id: "dm-alex-1",
    author: "alex",
    initials: "AL",
    timestamp: "yesterday",
    body: "hey, got a sec to look at the auth refactor before I push?",
    date: "Yesterday",
  },
  {
    id: "dm-alex-2",
    author: "yarin",
    initials: "YC",
    timestamp: "yesterday",
    body: "yeah send me the diff",
    date: "Yesterday",
  },
  {
    id: "dm-alex-3",
    author: "alex",
    initials: "AL",
    timestamp: "9:02",
    body: "ok PR is up — `auth-refactor` branch. main change is the middleware extraction",
    date: "Today",
  },
]

const DM_JAMIE: SampleMessage[] = [
  {
    id: "dm-jamie-1",
    author: "jamie",
    initials: "JM",
    timestamp: "8:12",
    body: "are we still on for the design review at 11?",
    date: "Today",
  },
  {
    id: "dm-jamie-2",
    author: "yarin",
    initials: "YC",
    timestamp: "8:14",
    body: "yes — link in the calendar invite",
    date: "Today",
  },
]

const DM_SASHA: SampleMessage[] = [
  {
    id: "dm-sasha-1",
    author: "sasha",
    initials: "SK",
    timestamp: "yesterday",
    body: "wanna pair on the rate-limit branch?",
    date: "Yesterday",
  },
]

const DM_MARCO: SampleMessage[] = [
  {
    id: "dm-marco-1",
    author: "marco",
    initials: "MR",
    timestamp: "Wed",
    body: "uploaded the typography exploration to figma. file is `Hush-Type-Scale-v3`",
    date: "Apr 30",
  },
]

const DM_ELENA: SampleMessage[] = [
  {
    id: "dm-elena-1",
    author: "elena",
    initials: "EM",
    timestamp: "Mon",
    body: "see you at the reading group on Wednesday",
    date: "Apr 30",
  },
]

export const MESSAGES_BY_CHANNEL: Record<string, SampleMessage[]> = {
  "dm-alex": DM_ALEX,
  "dm-jamie": DM_JAMIE,
  "dm-sasha": DM_SASHA,
  "dm-marco": DM_MARCO,
  "dm-elena": DM_ELENA,
  // Hush HQ channels
  general: HUSH_GENERAL,
  random: HUSH_RANDOM,
  announcements: HUSH_ANNOUNCEMENTS,
  // Design Studio channels
  "design-general": DESIGN_GENERAL,
  feedback: DESIGN_FEEDBACK,
  // Research Lab channels
  papers: RESEARCH_PAPERS,
  experiments: RESEARCH_EXPERIMENTS,
}

const PINNED_IDS_BY_CHANNEL: Record<string, string[]> = {
  general: ["h-g-1", "h-g-3"],
  random: ["h-r-1"],
  announcements: ["h-a-1"],
  "design-general": ["d-g-1"],
  feedback: ["d-f-1"],
  papers: ["r-p-1"],
}

export function getPinnedForChannel(channelId: string): SampleMessage[] {
  const ids = PINNED_IDS_BY_CHANNEL[channelId]
  if (!ids?.length) return []
  const messages = MESSAGES_BY_CHANNEL[channelId] ?? []
  const indexed = new Map(messages.map((m) => [m.id, m]))
  return ids.map((id) => indexed.get(id)).filter((m): m is SampleMessage => Boolean(m))
}

export function getMessagesForChannel(channelId: string): SampleMessage[] {
  return (
    MESSAGES_BY_CHANNEL[channelId] ?? [
      {
        id: "empty",
        author: "system",
        initials: "S",
        timestamp: "—",
        body: "_no messages yet — be the first to say hi_",
        date: "Today",
      },
    ]
  )
}
