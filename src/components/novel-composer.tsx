import * as React from "react"
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  Command as NovelCommand,
  StarterKit,
  Placeholder,
  TiptapLink,
  TiptapUnderline,
  CodeBlockLowlight,
  TaskList,
  TaskItem,
  renderItems,
  handleCommandNavigation,
  type EditorInstance,
} from "novel"
import { Extension } from "@tiptap/core"
import { useIsMobile } from "@/hooks/use-mobile"
import { Markdown } from "tiptap-markdown"
import { CodeIcon, BoldIcon, ItalicIcon } from "lucide-react"
import { common, createLowlight } from "lowlight"

import { cn } from "@/lib/utils"
import {
  createHushSlashItems,
  partitionSlashItems,
  type HushSlashCallbacks,
  type HushSuggestionItem,
} from "@/components/custom-slash-commands"

const lowlight = createLowlight(common)

const AUTO_DETECT_SUBSET = [
  "typescript",
  "javascript",
  "tsx",
  "jsx",
  "python",
  "bash",
  "shell",
  "json",
  "yaml",
  "go",
  "rust",
  "java",
  "kotlin",
  "swift",
  "c",
  "cpp",
  "csharp",
  "ruby",
  "php",
  "sql",
  "html",
  "css",
  "scss",
  "markdown",
  "dockerfile",
  "graphql",
]

const HLJS_TO_SHIKI: Record<string, string> = {
  typescript: "tsx",
  typescriptreact: "tsx",
  javascript: "jsx",
  javascriptreact: "jsx",
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  c: "c",
  cpp: "cpp",
  csharp: "cs",
  dockerfile: "docker",
  yml: "yaml",
}

function normalizeFenceLanguages(markdown: string): string {
  return markdown.replace(
    /^(\s*```)([A-Za-z0-9_+-]+)/gm,
    (_match, fence: string, lang: string) => {
      const lower = lang.toLowerCase()
      const mapped = HLJS_TO_SHIKI[lower] ?? lower
      return `${fence}${mapped}`
    }
  )
}

interface SubmitOnEnterOptions {
  onSubmit: () => void
}

const SubmitOnEnter = Extension.create<SubmitOnEnterOptions>({
  name: "submitOnEnter",
  priority: 1000,
  addOptions() {
    return { onSubmit: () => {} }
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        this.options.onSubmit()
        return true
      },
      "Shift-Enter": ({ editor }) =>
        editor.commands.first(({ commands }) => [
          () => commands.newlineInCode(),
          () => commands.splitListItem("listItem"),
          () => commands.splitBlock({ keepMarks: false }),
        ]),
    }
  },
})

export interface NovelComposerHandle {
  send: () => void
  isEmpty: () => boolean
  /** Insert raw text at the current cursor position. Used by the
   *  emoji picker — the picked unicode character lands in the editor
   *  exactly where the user was typing. */
  insertText: (text: string) => void
  focus: () => void
}

interface NovelComposerProps {
  channelName: string
  placeholder?: string
  onSend: (text: string) => void
  onEmptyChange?: (empty: boolean) => void
  onOpenGif?: () => void
  onOpenPoll?: () => void
  /** Allow firing onSend with an empty markdown body. Used when the
   *  parent has attachments queued and wants to send "attachments only". */
  allowEmpty?: boolean
}

export const NovelComposer = React.forwardRef<
  NovelComposerHandle,
  NovelComposerProps
>(function NovelComposer(
  {
    channelName,
    placeholder,
    onSend,
    onEmptyChange,
    onOpenGif,
    onOpenPoll,
    allowEmpty,
  },
  ref
) {
  const editorRef = React.useRef<EditorInstance | null>(null)
  const handleSendRef = React.useRef<() => void>(() => {})
  const isMobile = useIsMobile()
  const computedPlaceholder =
    placeholder ??
    (isMobile
      ? ""
      : `Message #${channelName} · / commands · Shift+Enter new block`)
  const [editorKey, setEditorKey] = React.useState(0)
  React.useEffect(() => {
    setEditorKey((prev) => prev + 1)
  }, [isMobile])
  const slashCallbacksRef = React.useRef<HushSlashCallbacks>({
    onOpenGif,
    onOpenPoll,
  })

  React.useEffect(() => {
    slashCallbacksRef.current = { onOpenGif, onOpenPoll }
  }, [onOpenGif, onOpenPoll])

  const suggestionItems = React.useMemo<HushSuggestionItem[]>(
    () =>
      createHushSlashItems({
        onOpenGif: () => slashCallbacksRef.current.onOpenGif?.(),
        onOpenPoll: () => slashCallbacksRef.current.onOpenPoll?.(),
      }),
    []
  )

  const slashCommand = React.useMemo(
    () =>
      NovelCommand.configure({
        suggestion: {
          items: () => suggestionItems,
          render: renderItems,
        },
      }),
    [suggestionItems]
  )

  const groupedItems = React.useMemo(
    () => partitionSlashItems(suggestionItems),
    [suggestionItems]
  )

  const handleSend = React.useCallback(() => {
    const editor = editorRef.current
    if (!editor) return
    const plain = editor.getText().trim()
    if (!plain && !allowEmpty) return

    editor.commands.command(({ tr, state }) => {
      state.doc.descendants((node, pos) => {
        if (node.type.name !== "codeBlock") return true
        if (node.attrs.language) return true
        const text = node.textContent
        if (!text.trim()) return true
        const result = lowlight.highlightAuto(text, {
          subset: AUTO_DETECT_SUBSET,
        })
        const lang = (result.data as { language?: string } | undefined)
          ?.language
        if (lang) {
          tr.setNodeMarkup(pos, undefined, { ...node.attrs, language: lang })
        }
        return true
      })
      return true
    })

    const storage = editor.storage as { markdown?: { getMarkdown: () => string } }
    const raw = storage.markdown?.getMarkdown().trim() || plain
    const markdown = normalizeFenceLanguages(raw)
    onSend(markdown)
    editor.commands.clearContent()
    onEmptyChange?.(true)
  }, [onSend, onEmptyChange, allowEmpty])

  React.useEffect(() => {
    handleSendRef.current = handleSend
  }, [handleSend])

  React.useImperativeHandle(
    ref,
    () => ({
      send: handleSend,
      isEmpty: () => {
        const editor = editorRef.current
        return !editor || editor.getText().trim().length === 0
      },
      insertText: (text: string) => {
        const editor = editorRef.current
        if (!editor || !text) return
        editor.chain().focus().insertContent(text).run()
      },
      focus: () => {
        editorRef.current?.commands.focus()
      },
    }),
    [handleSend]
  )

  return (
    <EditorRoot>
      <EditorContent
        key={editorKey}
        immediatelyRender={false}
        extensions={[
          StarterKit.configure({
            codeBlock: false,
            history: { depth: 50, newGroupDelay: 250 },
          }),
          CodeBlockLowlight.configure({
            lowlight,
            defaultLanguage: null,
            HTMLAttributes: {
              class: "rounded-md bg-muted p-3 font-mono text-xs",
            },
          }),
          Markdown.configure({
            html: false,
            tightLists: true,
            transformPastedText: true,
            transformCopiedText: true,
          }),
          TaskList.configure({
            HTMLAttributes: { class: "list-none pl-0 my-0" },
          }),
          TaskItem.configure({
            nested: true,
            HTMLAttributes: {
              class: "flex items-start gap-2 [&_p]:m-0",
            },
          }),
          Placeholder.configure({
            placeholder: ({ node }) =>
              node.type.name === "heading" ? "Heading" : computedPlaceholder,
          }),
          TiptapLink.configure({
            HTMLAttributes: { class: "text-primary underline-offset-2" },
          }),
          TiptapUnderline,
          slashCommand,
          SubmitOnEnter.configure({
            onSubmit: () => handleSendRef.current(),
          }),
        ]}
        onUpdate={({ editor }) => {
          editorRef.current = editor as EditorInstance
          onEmptyChange?.(editor.getText().trim().length === 0)
        }}
        onCreate={({ editor }) => {
          editorRef.current = editor as EditorInstance
        }}
        editorProps={{
          handlePaste: (view, event) => {
            const text = event.clipboardData?.getData("text/plain") ?? ""
            if (!text) return false
            const $from = view.state.selection.$from
            if ($from.parent.type.name === "codeBlock") return false
            const lines = text.split("\n")
            const looksIndented =
              lines.length > 1 &&
              lines.some((line) => /^[ \t]{2,}/.test(line))
            if (!looksIndented) return false
            const codeBlockType = view.state.schema.nodes.codeBlock
            if (!codeBlockType) return false
            const node = codeBlockType.create(
              { language: null },
              view.state.schema.text(text)
            )
            event.preventDefault()
            view.dispatch(view.state.tr.replaceSelectionWith(node))
            return true
          },
          handleDOMEvents: {
            keydown: (_view, event) => {
              if (
                event.key === "Tab" &&
                !event.shiftKey &&
                !event.metaKey &&
                !event.ctrlKey
              ) {
                const selected = document.querySelector<HTMLElement>(
                  '[cmdk-item][data-selected="true"]'
                )
                if (selected) {
                  event.preventDefault()
                  selected.click()
                  return true
                }
              }
              return handleCommandNavigation(event)
            },
          },
          attributes: {
            class: cn(
              "prose prose-sm max-w-none outline-none",
              "py-1.5",
              "prose-p:my-0 prose-p:leading-relaxed",
              "prose-pre:my-2 prose-pre:rounded-md prose-pre:bg-muted prose-pre:p-3 prose-pre:text-foreground",
              "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground",
              "dark:prose-invert"
            ),
          },
        }}
        className="w-full"
      >
        <EditorCommand className="z-50 max-h-72 w-72 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
          <EditorCommandEmpty className="px-2 py-1.5 text-xs text-muted-foreground">
            No matches.
          </EditorCommandEmpty>
          <EditorCommandList>
            {groupedItems.actions.length > 0 ? (
              <SlashSection title="Azioni Chat" items={groupedItems.actions} />
            ) : null}
            {groupedItems.actions.length > 0 &&
            groupedItems.formatting.length > 0 ? (
              <div className="my-1 h-px bg-border" />
            ) : null}
            {groupedItems.formatting.length > 0 ? (
              <SlashSection
                title="Formattazione"
                items={groupedItems.formatting}
              />
            ) : null}
          </EditorCommandList>
        </EditorCommand>
        <EditorBubble className="flex gap-1 rounded-md border bg-popover p-1 shadow-md">
          <BubbleButton
            label="Bold"
            icon={<BoldIcon className="size-4" />}
            mark="bold"
          />
          <BubbleButton
            label="Italic"
            icon={<ItalicIcon className="size-4" />}
            mark="italic"
          />
          <BubbleButton
            label="Code"
            icon={<CodeIcon className="size-4" />}
            mark="code"
          />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  )
})

function SlashSection({
  title,
  items,
}: {
  title: string
  items: HushSuggestionItem[]
}) {
  return (
    <>
      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      {items.map((item) => (
        <EditorCommandItem
          key={item.title}
          value={item.title}
          onCommand={(val) => item.command?.(val)}
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm aria-selected:bg-muted"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded border bg-background">
            {item.icon}
          </span>
          <div className="flex flex-col">
            <span className="font-medium">{item.title}</span>
            <span className="text-xs text-muted-foreground">
              {item.description}
            </span>
          </div>
        </EditorCommandItem>
      ))}
    </>
  )
}

function BubbleButton({
  label,
  icon,
  mark,
}: {
  label: string
  icon: React.ReactNode
  mark: string
}) {
  return (
    <EditorBubbleItem
      onSelect={(editor) => editor.chain().focus().toggleMark(mark).run()}
      className="flex size-7 cursor-pointer items-center justify-center rounded-sm hover:bg-muted aria-selected:bg-muted"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </EditorBubbleItem>
  )
}
