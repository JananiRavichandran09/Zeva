import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Mic,
  Paperclip,
  ArrowUp,
  CalendarPlus,
} from 'lucide-react'

type Role = 'user' | 'assistant'

interface ChatMessage {
  id: string
  role: Role
  content: string
  actions?: string[]
}

const initialMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'assistant',
    content:
      'Good morning, Janani 👋 You have no standup scheduled today. Want me to set one up at 10:00 AM?',
    actions: ['Schedule standup', 'Not today'],
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'Heads up — the sprint ends tomorrow and no review meeting is on the calendar. Shall I create one?',
    actions: ['Create review', 'Dismiss'],
  },
]

const quickSuggestions = [
  "Create today's standup",
  'Reschedule meetings',
  'Create follow-up',
  'Show blockers',
  "Generate today's plan",
  'Schedule client meeting',
  'Summarize yesterday',
  'Convert notes into tasks',
]

export default function ChatAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  function scrollToEnd() {
    requestAnimationFrame(() =>
      endRef.current?.scrollIntoView({ behavior: 'smooth' }),
    )
  }

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: trimmed },
    ])
    setInput('')
    setThinking(true)
    scrollToEnd()

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            "Once I'm connected to your workspace, I'll actually carry this out — schedule it, assign owners, and follow up. For now this is a preview response.",
        },
      ])
      setThinking(false)
      scrollToEnd()
    }, 900)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-8 py-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white shadow-md shadow-[#6c63ff]/30">
          <Sparkles size={18} />
        </span>
        <div className="leading-tight">
          <h1 className="text-lg font-semibold">Chat AI</h1>
          <p className="text-xs text-muted">
            Ask Zeva to plan, schedule, and coordinate your work
          </p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Online
        </span>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={m.role === 'user' ? 'flex justify-end' : ''}
              >
                {m.role === 'assistant' ? (
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand">
                      <Sparkles size={15} />
                    </span>
                    <div className="min-w-0">
                      <div className="rounded-2xl rounded-tl-sm bg-elevated px-4 py-2.5 text-sm leading-relaxed text-fg">
                        {m.content}
                      </div>
                      {m.actions && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {m.actions.map((a, i) => (
                            <button
                              key={a}
                              type="button"
                              className={[
                                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                i === 0
                                  ? 'bg-brand text-brand-fg hover:opacity-90'
                                  : 'border border-line text-muted hover:bg-elevated hover:text-fg',
                              ].join(' ')}
                            >
                              {i === 0 && <CalendarPlus size={13} />}
                              {a}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-4 py-2.5 text-sm leading-relaxed text-brand-fg">
                    {m.content}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {thinking && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand">
                <Sparkles size={15} />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-elevated px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="px-8 pb-6">
        <div className="mx-auto max-w-3xl">
          {/* Quick suggestions */}
          <div className="mb-3 flex flex-wrap gap-2">
            {quickSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand/40 hover:bg-elevated hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-surface p-2 shadow-sm transition-colors focus-within:border-brand/50">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask Zeva anything..."
              className="max-h-40 w-full resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder:text-muted focus:outline-none"
            />
            <div className="flex items-center justify-between px-1 pt-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Attach file"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-fg"
                >
                  <Paperclip size={17} />
                </button>
                <button
                  type="button"
                  aria-label="Voice input"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-fg"
                >
                  <Mic size={17} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => send(input)}
                disabled={!input.trim()}
                aria-label="Send"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowUp size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
