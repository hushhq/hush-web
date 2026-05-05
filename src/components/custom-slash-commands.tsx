import {
  CodeIcon,
  QuoteIcon,
  ListIcon,
  ListOrderedIcon,
  Heading1Icon,
  Heading2Icon,
  CheckSquareIcon,
  ImageIcon,
  BarChart3Icon,
} from "lucide-react"
import {
  createSuggestionItems,
  type SuggestionItem,
} from "novel"

export type SlashGroup = "actions" | "formatting"

export interface HushSuggestionItem extends SuggestionItem {
  group: SlashGroup
}

/** Screen-space rect of the caret at slash invocation. Used by the
 *  parent composer to position floating popovers (GIF picker, etc.)
 *  in line with the slash menu instead of jumping to a toolbar button. */
export interface SlashAnchorRect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface HushSlashCallbacks {
  onOpenGif?: (anchor: SlashAnchorRect | null) => void
  onOpenPoll?: (anchor: SlashAnchorRect | null) => void
}

function caretAnchorFromEditor(
  editor: { view: { coordsAtPos: (pos: number) => { left: number; top: number; right: number; bottom: number } } },
  pos: number
): SlashAnchorRect | null {
  try {
    const c = editor.view.coordsAtPos(pos)
    return { left: c.left, top: c.top, right: c.right, bottom: c.bottom }
  } catch {
    return null
  }
}

export function createHushSlashItems(
  callbacks: HushSlashCallbacks
): HushSuggestionItem[] {
  const items = createSuggestionItems([
    {
      title: "GIF (beta)",
      description: "Insert a GIF from GIPHY",
      searchTerms: ["gif", "image", "media", "giphy"],
      icon: <ImageIcon className="size-4" />,
      command: ({ editor, range }) => {
        const anchor = caretAnchorFromEditor(editor, range.from)
        editor.chain().focus().deleteRange(range).run()
        callbacks.onOpenGif?.(anchor)
      },
    },
    {
      title: "Poll",
      description: "Create a poll",
      searchTerms: ["poll", "survey", "vote"],
      icon: <BarChart3Icon className="size-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        callbacks.onOpenPoll?.(null)
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading",
      searchTerms: ["title", "h1", "big"],
      icon: <Heading1Icon className="size-4" />,
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run(),
    },
    {
      title: "Heading 2",
      description: "Medium section heading",
      searchTerms: ["subtitle", "h2"],
      icon: <Heading2Icon className="size-4" />,
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run(),
    },
    {
      title: "Bullet list",
      description: "Unordered list",
      searchTerms: ["unordered", "ul"],
      icon: <ListIcon className="size-4" />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
      title: "Numbered list",
      description: "Ordered list",
      searchTerms: ["ordered", "ol"],
      icon: <ListOrderedIcon className="size-4" />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },
    {
      title: "Task list",
      description: "Track to-dos inline",
      searchTerms: ["todo", "checkbox"],
      icon: <CheckSquareIcon className="size-4" />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    },
    {
      title: "Quote",
      description: "Block quote",
      searchTerms: ["blockquote"],
      icon: <QuoteIcon className="size-4" />,
      command: ({ editor, range }) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code block",
      description: "Syntax-highlighted code (auto-detect)",
      searchTerms: ["code", "snippet"],
      icon: <CodeIcon className="size-4" />,
      command: ({ editor, range }) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
  ])

  return items.map((item, index) => ({
    ...item,
    group: index < 2 ? "actions" : "formatting",
  }))
}

export function partitionSlashItems(items: HushSuggestionItem[]) {
  return {
    actions: items.filter((item) => item.group === "actions"),
    formatting: items.filter((item) => item.group === "formatting"),
  }
}
