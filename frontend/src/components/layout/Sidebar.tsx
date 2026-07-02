import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  Sparkles,
  Calendar,
  Video,
  ListChecks,
  FolderKanban,
  Users,
  FileText,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Tooltip } from '@/components/ui'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chat-ai', label: 'Chat AI', icon: Bot },
  { to: '/coordinator', label: 'AI Coordinator', icon: Sparkles },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/meetings', label: 'Meetings', icon: Video },
  { to: '/tasks', label: 'Tasks', icon: ListChecks },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/documents', label: 'Documents', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const STORAGE_KEY = 'zeva.sidebar-collapsed'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(collapsed))
  }, [collapsed])

  return (
    <aside
      className={[
        'relative flex shrink-0 flex-col bg-surface transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[84px]' : 'w-[280px]',
      ].join(' ')}
    >
      {/* Brand */}
      <div
        className={[
          'flex items-center gap-3 px-5 py-5',
          collapsed ? 'justify-center' : '',
        ].join(' ')}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white shadow-lg shadow-[#6c63ff]/30">
          <Sparkles size={20} strokeWidth={2.25} />
        </span>
        {!collapsed && (
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-lg font-semibold tracking-tight">
              Zeva
            </p>
            <p className="truncate text-xs text-muted">Work Coordinator</p>
          </div>
        )}
      </div>

      {/* Collapse toggle on the edge */}
      <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute right-0 top-8 z-20 flex h-7 w-7 translate-x-1/2 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-sm transition-all duration-200 hover:border-brand/50 hover:text-brand"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </Tooltip>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {navItems.map((item) => (
          <SidebarLink key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}

function SidebarLink({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200',
          collapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-brand/10 text-brand'
            : 'text-muted hover:bg-elevated hover:text-fg',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
          )}
          <Icon
            size={19}
            strokeWidth={2}
            className={
              isActive
                ? 'text-brand'
                : 'text-muted transition-colors group-hover:text-fg'
            }
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip title={item.label} placement="right">
        {link}
      </Tooltip>
    )
  }
  return link
}
