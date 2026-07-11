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
import { useShell } from '@/app/ShellProvider'
import type { LucideIcon } from 'lucide-react'

/** Map shape strings from shell-info.json to Lucide icons */
const ICON_MAP: Record<string, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'bot': Bot,
  'sparkles': Sparkles,
  'calendar': Calendar,
  'video': Video,
  'list-checks': ListChecks,
  'folder-kanban': FolderKanban,
  'users': Users,
  'file-text': FileText,
  'bar-chart-3': BarChart3,
  'bell': Bell,
  'settings': Settings,
}

const STORAGE_KEY = 'zeva.sidebar-collapsed'

export default function Sidebar() {
  const { menu } = useShell()

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

      {/* Nav — driven by shell menu (already filtered by feature flags) */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
        {menu.map((item) => {
          const Icon = ICON_MAP[item.shape ?? ''] ?? LayoutDashboard
          const path = item.path ?? '/'

          const link = (
            <NavLink
              key={item.id}
              to={path}
              end={path === '/'}
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
              <Tooltip key={item.id} title={item.label} placement="right">
                {link}
              </Tooltip>
            )
          }
          return <div key={item.id}>{link}</div>
        })}
      </nav>
    </aside>
  )
}
