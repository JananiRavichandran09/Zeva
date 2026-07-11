import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Card, PageHeader, Spinner, Avatar } from '@/components/ui'
import { Send, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '@/app/AuthProvider'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  intent?: string
  suggestions?: string[]
  timestamp: Date
}

function MessageBubble({ msg, onSuggestion }: { msg: ChatMessage; onSuggestion: (s: string) => void }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand mt-1">
          <Bot size={15} />
        </div>
      )}

      <div className={`flex max-w-[78%] flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-brand text-white'
              : 'rounded-tl-sm bg-elevated text-fg'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-fg">{children}</strong>,
                  ul: ({ children }) => <ul className="my-2 space-y-1 pl-4">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-1 pl-4 list-decimal">{children}</ol>,
                  li: ({ children }) => (
                    <li className="flex gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60" />
                      <span>{children}</span>
                    </li>
                  ),
                  table: ({ children }) => (
                    <div className="my-2 overflow-x-auto rounded-lg border border-line">
                      <table className="min-w-full text-xs">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-canvas">{children}</thead>,
                  th: ({ children }) => (
                    <th className="px-3 py-2 text-left font-semibold text-fg">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="border-t border-line px-3 py-2 text-muted">{children}</td>
                  ),
                  code: ({ children }) => (
                    <code className="rounded bg-canvas px-1.5 py-0.5 font-mono text-xs text-brand">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-2 border-l-2 border-brand pl-3 text-muted italic">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="mb-1 text-base font-bold text-fg">{children}</h1>,
                  h2: ({ children }) => <h2 className="mb-1 text-sm font-bold text-fg">{children}</h2>,
                  h3: ({ children }) => <h3 className="mb-1 text-sm font-semibold text-fg">{children}</h3>,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {msg.suggestions && msg.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {msg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSuggestion(s)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand hover:text-brand"
              >
                <Sparkles size={10} />
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="px-1 text-[10px] text-muted/60">
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {isUser && (
        <Avatar name={msg.content} sx={{ width: 32, height: 32, fontSize: 12 }} />
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand mt-1">
        <Bot size={15} />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-elevated px-4 py-3.5">
        <div className="flex gap-1 items-center">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}

export default function ChatAIPage() {
  const { user, token } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi **${user?.name?.split(' ')[0] ?? 'there'}**! I'm Zeva, your AI work coordinator.\n\nI can help you with:\n- **Daily briefing** — what's on your plate today\n- **Meeting prep** — context before your next meeting\n- **Task management** — status, blockers, priorities\n- **Team workload** — who has capacity, who is overloaded\n\nWhat would you like to know?`,
      suggestions: ["What's on my plate today?", 'Prep me for my next meeting', 'Show my tasks'],
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text.trim() }),
      })

      const data = await res.json()

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message ?? 'Sorry, I could not process that.',
        intent: data.intent,
        suggestions: data.suggestions,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden p-8">
      <PageHeader title="Chat AI" subtitle="Ask Zeva anything about your work" />

      <Card className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden" noPadding>
        {/* Messages scroll area */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onSuggestion={(s) => void sendMessage(s)} />
          ))}

          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-line bg-surface px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void sendMessage(input)
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Zeva anything..."
              className="flex-1 rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-fg placeholder:text-muted focus:border-brand focus:outline-none transition-colors"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-opacity disabled:opacity-40 hover:opacity-90"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
