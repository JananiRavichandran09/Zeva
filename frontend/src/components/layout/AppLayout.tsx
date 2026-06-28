import { NavLink, Outlet } from 'react-router-dom'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

type NavItem = {
  to: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: <SpaceDashboardOutlinedIcon fontSize="small" />,
  },
  {
    to: '/chat',
    label: 'Chat',
    icon: <ChatBubbleOutlineIcon fontSize="small" />,
  },
]

export default function AppLayout() {
  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-800">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-700 text-white">
            <AutoAwesomeIcon fontSize="small" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Zeva</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-50 text-violet-700'
                    : 'text-slate-600 hover:bg-slate-100',
                ].join(' ')
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 text-xs text-slate-400">
          AI Work Assistant
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
