# Hush — Design Principles

This document captures the design and engineering principles that drive Hush's
prototype. It is a living reference for anyone building UI in this codebase.
Read it before adding new surfaces, refactoring existing ones, or wiring new
flows.

---

## 1. Foundations

### 1.1 Stack

- **shadcn/ui (new-york style, Radix primitives, lucide icons)** as the
  default component vocabulary.
- **Tailwind v4** with `@theme inline` for token-driven styling. No ad-hoc hex
  values — only theme tokens.
- **Geist Sans** for UI text, **Geist Mono** for IDs, codes, timestamps,
  versions.
- **Aceternity Timeline** for the roadmap surface.
- **dnd-kit** for drag-and-drop (channels, categories, root zone).
- **Tiptap + Novel** for the chat composer (slash commands, code blocks,
  paste-to-codeblock).
- **LiveKit** for voice/video, with mock fallback when running prototype-only.

### 1.2 Token system

Everything draws from CSS variables in `src/index.css`:

| Token | Usage |
|-|-|
| `--background` / `--foreground` | Root surface and text |
| `--card` / `--card-foreground` | Floating panels (channel sidebar, members, popovers) |
| `--popover` / `--popover-foreground` | Tooltips, dropdowns, profile cards |
| `--primary` | One accent — buttons, focus rings, beam highlight |
| `--secondary` / `--muted` / `--accent` | Hover states, subtle backgrounds |
| `--success` | Speaking indicators inside calls, "shipped" badge |
| `--destructive` | Logout, delete server, kick member |
| `--sidebar` and friends | The outer rail/dock chrome |
| `--border` / `--input` / `--ring` | Lines and focus |
| `--radius` | Single source of truth for corner rounding |

All radius tokens (`--radius-sm/md/lg/xl/2xl/3xl/4xl`) derive from `--radius`
via `calc()`. Change `--radius` once → entire app rescales coherently. Default
is `0.5rem` (shadcn medium preset).

**Rule:** never use raw Tailwind palette classes (`bg-blue-500`,
`text-zinc-300`, etc.) on foundational surfaces. They break theming and dark
mode. Use semantic tokens (`bg-card`, `text-muted-foreground`,
`border-border`).

### 1.3 Density

One density per surface: **comfortable** (`p-6`, `gap-6`, `text-sm`) for
content surfaces; **compact** (`p-2`, `gap-1`, `text-xs`) for navigation rails
and channel lists. Don't mix.

---

## 2. Composition over reinvention

Reach for shadcn primitives before writing custom markup:

| Use case | Reach for | Why |
|-|-|-|
| Settings page | `Dialog` + `Sidebar` (collapsible="none") | sidebar-13 pattern — left nav, right content |
| Destructive confirmation | `AlertDialog` | Never plain `Dialog` for irreversible ops |
| Members list, pinned messages, profile card | `Popover` | Anchored, dismissible, no overlay |
| Right-click on member, on channel section | `ContextMenu` | Native pattern, supports separators + destructive variant |
| Slide-in panels (mobile sidebar, members on mobile) | `Sheet` | Auto-handles backdrop, focus, ESC |
| Mobile-vs-desktop component split | Same component, branch on `useIsMobile()` | One source of truth |
| Status pills | `Badge` | Variant-driven |
| Hover affordances | `Tooltip` with `delayDuration={0}` | Used on voice avatar groups for full names list |
| Empty/loading/error | `Skeleton`, designed empty-state cards | Never raw "Loading..." text |

### 2.1 Forms

Use `Field` + `FieldLabel` + control + `FieldDescription`. Never a `div +
label` ladder. Validation: `data-invalid` on `Field`, `aria-invalid` on the
control. The pattern shows up in user-settings → My account: identity rows
that read field/label/value/action without bespoke layout glue.

### 2.2 The four authentication views

The auth flow demonstrates the composition rule: a single `AuthFlow` shell
(logo + dynamic title + `Card` + persistent `PanelFooter` with
`InstanceSelector`) renders four panels via a single `view` state. Each panel
shares the footer; only the body differs. This is the same shape we use for
the settings dialog (one `SettingsDialog` shell driving server-settings and
user-settings with different `sections[]`).

---

## 3. Color coding — semantic and stable

| Concept | Color | Usage |
|-|-|-|
| Default text | `foreground` | Most body text |
| De-emphasized text | `muted-foreground` | Timestamps, hints, secondary labels |
| Action / focus | `primary` | Sign-in button, send button, beam highlight, active state |
| Positive | `success` (oklch ~0.62 0.17 150) | Speaking ring inside call, "Shipped" badge, valid form state |
| Warning / destructive | `destructive` | Logout, leave server, delete, kick |
| Mention | `bg-primary/5 hover:bg-primary/10` on the message row | Subtle, scannable |
| Roadmap status | `done`/`active`/`planned`/`future` map to success/primary/muted/border-only | Visual hierarchy of progress |

**Rule:** never use color alone to communicate. Speaking status pairs ring +
animated dot + tooltip. Destructive items pair red color + icon + text + an
`AlertDialog` confirmation step.

**Privacy-driven omission:** the server does not push "is speaking" to the
client outside of an active call. Therefore the **sidebar avatar group must
not** show speaking state — it's misleading to display data the protocol
won't deliver. Only mute/deafen (stable client-known state) is shown there.
Speaking ring is reserved for the in-call tile.

---

## 4. Interaction rules

### 4.1 Drag-and-drop (dnd-kit)

- Normalized data: `Channel { categoryId: string | null }` flat array,
  `Category { id, name }` flat array.
- Three `SortableContext` layers: categories, root channels (`__root__`
  droppable), per-category channels (`cat-zone-{id}` droppable). Root
  channels render above the first category — like Discord.
- Custom `collisionDetection` filters droppables by `accepts[]` matching the
  dragged kind, so categories can only swap with categories and channels can
  only land on channel zones.
- `onDragOver` patches `categoryId` optimistically while hovering a different
  category zone — the user sees the channel migrate live.
- `onDragEnd` commits via `arrayMove` per subset, then merges back. State
  lives in `App.tsx`; the sidebar dispatches via `onCategoriesChange` /
  `onChannelsChange`.

### 4.2 Keyboard

- `Cmd+K` global command palette, `Cmd+/` cheat sheet, `Cmd+1..9` jump to
  rail, `Alt+Arrow` channel nav, `Cmd+[/]` history, `Cmd+Shift+M/D`
  mute/deafen during a call, `Esc` mark-as-read.
- Composer: **Enter sends**, **Shift+Enter** creates a new block (and
  *exits* a heading via `splitBlock({keepMarks:false})`). **Tab** confirms
  the slash menu's selected item.
- Cheat sheet groups all of this in a tabbed dialog — surfaceable via
  shortcut, not buried in settings.

### 4.3 Hover states

- Hover never adds new affordances that require deduction: it reveals
  buttons (Reply / Open thread / Pin / More) on a message row, *not*
  alternative meanings.
- All hover transitions: `transition-colors`. Keep it cheap.
- Avoid hover affordances that can't be triggered without a pointer (mobile
  reveals the same actions via a long-press menu).

### 4.4 Hover ≠ click

The pinned-messages popover demonstrates this: hover reveals the **Jump**
button via `opacity-0 → group-hover:opacity-100`. Crucially, the button is
**always in the DOM at full size** — it does not push the row taller on
hover. This is non-negotiable: hover-revealed UI must never reflow the
container.

---

## 5. Layout rules

### 5.1 Frame discipline

- The members panel does **not** slide in over the channel-view frame.
  It's an **in-flow** `<aside>` inside the rounded card, with width
  transitioning from `0` to `16rem`. The parent gets `overflow: hidden` so
  the rounded corners clip the panel as it appears.
- Channel-view's column header (`h-14`) and the members header (`h-14`)
  must align — the horizontal border line is **continuous** across both.
- The mobile equivalent of the members panel is a `Sheet`. We keep one
  component, one state, two presentations.

### 5.2 Avoid mix-blend pile-up

shadcn's `Avatar` uses `after:mix-blend-darken` for its border. Forty
avatars + a parent transition = compositing storm and paint glitches. In
high-density places (member sidebar, mock voice grid) we **replace
shadcn's Avatar with a plain rounded `<span>`**. This was a real bug; the
rule sticks.

### 5.3 Scroll containers

Global `html, body { overflow: hidden }` keeps the chat from bouncing.
Surfaces that need real page scroll (the roadmap) use
`fixed inset-0 overflow-y-auto`. They are their own scroll container, and
any scroll-driven motion (Aceternity's beam on the timeline) takes a
`scrollContainer` ref so `useScroll({ container })` can track it.

### 5.4 Sticky and z-index

A sticky header with `bg-background/80 backdrop-blur` must sit above any
sticky elements inside the page (`z-10` for header, `z-0` for sticky
timeline dots). Translucent layers cannot be allowed to leak content
through.

---

## 6. Motion

- Prefer **transitions** for state changes (`transition-colors`,
  `transition-[width]`). Cheap, predictable.
- Use **motion (framer-motion)** for scroll-driven effects only — the
  roadmap beam tracks `useScroll` progress and animates its own height.
- Animation duration default: **200ms**. Anything longer must be
  justified (e.g. 1.6s `jump-flash` so the destination message is
  obviously highlighted).
- Never animate `box-shadow` on hover for many-element grids; it's
  expensive and produces tearing on transitions.

---

## 7. Defensive design choices

### 7.1 In-memory auth (prototype)

The login gate uses plain `useState`. Reload sends the user back to the
login screen. Persistence is intentionally absent — it forces design of
the login surface as a **first-class screen**, not an afterthought
behind a "logged in" flag.

### 7.2 Instance selector is persistent

Across **every** auth view (main, sign-in, link, sign-up), the
`InstanceSelector` is part of `PanelFooter`. Users who self-host can
switch the instance without leaving the flow. Reasoning: Hush is open
source and self-hostable; the instance is part of identity, not a
setting hidden after login.

### 7.3 Always confirm the destructive

Every destructive action — Logout (sidebar dropdown + settings panel),
Disable account, Delete account, Leave server, Delete server, Kick member
— routes through an `AlertDialog`. We use a thin reusable `ConfirmAction`
wrapper to keep call sites short and consistent. Plain `Dialog` is
forbidden for these flows.

### 7.4 BIP39 entry uses a 4×3 grid

Pasting 12 words distributes across cells. Space/Tab navigates forward;
Backspace on empty cell goes back. The textarea fallback was rejected
because it loses positional context: the grid makes "I dropped a word"
visible at a glance.

### 7.5 Code presented for copy gets visual centering compensation

The fallback code block for device linking is a 28×28 button + `pl-7`
matched code block. The padding on the left equals the width of the copy
button on the right, so the **visual center of the code aligns with the
center of the container**. We learned this trick from the demo's CSS,
not from the first three attempts at flex centering.

---

## 8. Anti-patterns we forbid

| Don't | Do |
|-|-|
| Roll your own dropdown / dialog / popover | Use shadcn primitives |
| Use `Dialog` for "are you sure?" | Use `AlertDialog` |
| Hardcode hex / Tailwind palette on foundational UI | Use CSS variable tokens |
| Build "loading..." text or empty `<div>` placeholders | Use `Skeleton` and designed empty states |
| Override component sizes via mass `className` | Use the component's `size` variant or compose |
| Hide errors silently | Surface via `Alert` or a stable inline message |
| Mix two accent colors competing for attention | One accent per page |
| Stack rounded cards inside rounded cards inside rounded cards | Flatten — one card per logical group |
| Reflow on hover | Reserve space; toggle opacity |
| Use long animations on many-element transitions | Cap at 200ms unless justified |
| Push speaking-state to surfaces where the protocol won't deliver it | Show only what the data layer guarantees |
| Treat mobile as a port of desktop | Branch on `useIsMobile()` and render the right primitive (Sheet vs in-flow aside) |

---

## 9. Per-surface playbook

### Login & device-link
`Card` + `Button` + `InstanceSelector`. Title `font-semibold` (lighter
than default `font-bold`). One primary CTA, one secondary CTA, one
text-link to sign-up. Sub-views inherit the same `PanelFooter` with the
roadmap link.

### Settings (server, user)
`Dialog` shell with `SidebarProvider`-mounted nav (`collapsible="none"`),
content area scrolls. Section list grouped by category, destructive
items at the bottom in their own group with `variant=destructive`
styling on the menu button.

### Channel sidebar
- System channels (Server log, Moderation) at top, no DnD.
- Root orphan channels next, draggable, collapsible-free.
- Categories with nested channels, both layers reorderable.
- Voice channels show an `AvatarGroup` (4 max + "+N") of current
  participants. Tooltip on hover (zero delay) lists the names.

### Voice channel view
Pre-join screen → in-call grid. With LiveKit token: real participants.
Without (prototype): mock grid with one tile per participant; speaking
ring uses `--success`; mute/deafen icons in name overlay.

### Roadmap
Aceternity `Timeline` with `scrollContainer` plumbed through; one entry
per milestone, content shows status badge + summary + per-release
detail cards. Newest milestones on top, scroll downward through history.

---

## 10. The North Star

> Build product that feels like it was made by people who care about the
> details. Every pixel counts. Match the shadcn vocabulary. Compose, don't
> reinvent. Refuse magic colors. Ship destructive flows behind a
> confirmation. Keep motion cheap. Speak through tokens.

If a change can't be expressed in this vocabulary, the change is wrong, or
the vocabulary needs to grow — but never both at the same time.
