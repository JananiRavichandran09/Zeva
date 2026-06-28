import { useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

type Role = 'user' | 'assistant'

type Message = {
  id: string
  role: Role
  content: string
}

const initialMessages: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      "Hi, I'm Zeva. Tell me what you'd like to get done and I'll take care of it. Try: \"Remind me to review the PR tomorrow.\"",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const listEndRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    requestAnimationFrame(() => {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    // Placeholder assistant reply until the backend + AI are wired up.
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        "I hear you. Once my backend is connected, I'll actually act on this. For now this is a mocked reply.",
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
    scrollToBottom()
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-slate-200 bg-white px-8 py-4">
        <h1 className="text-lg font-semibold text-slate-900">Chat</h1>
        <p className="text-sm text-slate-500">Your AI work assistant</p>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={listEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <TextField
            fullWidth
            multiline
            maxRows={5}
            placeholder="Ask Zeva to do something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start gap-3'}>
      {!isUser && (
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-700 text-white">
          <AutoAwesomeIcon fontSize="small" />
        </span>
      )}
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-violet-700 text-white'
            : 'bg-white text-slate-800 ring-1 ring-slate-200',
        ].join(' ')}
      >
        {message.content}
      </div>
    </div>
  )
}
