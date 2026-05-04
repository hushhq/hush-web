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

export interface HushSlashCallbacks {
  onOpenGif?: () => void
  onOpenPoll?: () => void
}

export function createHushSlashItems(
  callbacks: HushSlashCallbacks
): HushSuggestionItem[] {
  const items = createSuggestionItems([
    {
      title: "GIF",
      description: "Insert a GIF from the picker",
      searchTerms: ["gif", "image", "media"],
      icon: <ImageIcon className="size-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        callbacks.onOpenGif?.()
      },
    },
    {
      title: "Poll",
      description: "Create a poll",
      searchTerms: ["poll", "survey", "vote"],
      icon: <BarChart3Icon className="size-4" />,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run()
        callbacks.onOpenPoll?.()
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
