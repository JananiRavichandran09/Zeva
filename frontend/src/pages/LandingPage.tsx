import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Calendar,
  ListChecks,
  Users,
  Brain,
  BarChart3,
  Mic,
  Bot,
  Play,
  ArrowRight,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = { label: string; icon: LucideIcon }

const features: Feature[] = [
  { label: 'AI Scheduling', icon: Calendar },
  { label: 'Smart Tasks', icon: ListChecks },
  { label: 'Team Coordination', icon: Users },
  { label: 'Meeting Summaries', icon: Brain },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Voice Commands', icon: Mic },
  { label: 'Proactive AI', icon: Bot },
  { label: 'Daily Plans', icon: Sparkles },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="dark relative flex min-h-screen flex-col bg-canvas text-fg">
      {/* Subtle gradient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-brand-2/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 lg:px-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white shadow-lg shadow-[#6c63ff]/30">
            <Sparkles size={20} strokeWidth={2.25} />
          </span>
          <span className="text-xl font-bold tracking-tight text-fg">Zeva</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg shadow-md shadow-brand/30 transition-all hover:opacity-90"
          >
            Get started free
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex max-w-3xl flex-col items-center"
        >
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-muted shadow-sm">
            <Sparkles size={14} className="text-brand" />
            AI-Powered Work Coordination Platform
          </span>

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-fg sm:text-5xl lg:text-6xl">
            Your Intelligent{' '}
            <span className="bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] bg-clip-text text-transparent">
              Work Companion
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            The AI-powered workspace that manages your tasks, schedules meetings,
            detects blockers, and generates daily plans — all through natural
            conversation. Work less. Achieve more.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-brand-fg shadow-lg shadow-brand/30 transition-all hover:gap-3 hover:opacity-90"
            >
              Get Started
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-fg shadow-sm transition-all hover:border-brand/40 hover:bg-elevated"
            >
              <Play size={16} className="text-brand" />
              Watch Demo
            </button>
          </div>

          {/* Feature chips */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.span
                  key={f.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-medium text-muted shadow-sm"
                >
                  <Icon size={14} className="text-brand" />
                  {f.label}
                </motion.span>
              )
            })}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} Zeva. Built with passion.
      </footer>

      {/* Demo modal (placeholder video) */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-surface shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-elevated text-muted hover:text-fg"
              aria-label="Close demo"
            >
              <X size={16} />
            </button>
            <div className="flex aspect-video items-center justify-center bg-elevated">
              <div className="text-center">
                <Play size={48} className="mx-auto text-brand/50" />
                <p className="mt-3 text-sm text-muted">
                  Demo video coming soon — product walkthrough will be here.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
