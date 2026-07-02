import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ButtonBase from '@mui/material/ButtonBase'
import {
  Search,
  Plus,
  Bell,
  Calendar,
  ListChecks,
  Video,
  FolderKanban,
  FileText,
  Sun,
  Moon,
  UserCircle2,
  LogOut,
} from 'lucide-react'
import { IconButton, Avatar } from '@/components/ui'
import { useThemeMode } from '@/app/ThemeModeProvider'
import { useAuth } from '@/app/AuthProvider'

const quickCreateItems = [
  { label: 'New task', icon: ListChecks },
  { label: 'New meeting', icon: Video },
  { label: 'New project', icon: FolderKanban },
  { label: 'New document', icon: FileText },
]

export default function TopBar() {
  const navigate = useNavigate()
  const { mode, toggleMode } = useThemeMode()
  const { user, logout } = useAuth()
  const [createAnchor, setCreateAnchor] = useState<HTMLElement | null>(null)
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null)

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 bg-surface px-6">
      {/* Global command / search bar */}
      <button
        type="button"
        className="group flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-line bg-canvas px-4 text-left transition-all duration-200 hover:border-brand/40"
        aria-label="Search or run a command"
      >
        <Search
          size={16}
          className="text-muted transition-colors group-hover:text-brand"
        />
        <span className="flex-1 text-sm text-muted">
          Search or type a command...
        </span>
        <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 text-[11px] font-medium text-muted">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* Quick create */}
      <IconButton
        label="Quick create"
        onClick={(e) => setCreateAnchor(e.currentTarget)}
        sx={{
          bgcolor: 'primary.main',
          color: '#fff',
          width: 40,
          height: 40,
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        <Plus size={18} />
      </IconButton>
      <Menu
        anchorEl={createAnchor}
        open={Boolean(createAnchor)}
        onClose={() => setCreateAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 200, borderRadius: 3, mt: 1 } } }}
      >
        {quickCreateItems.map((item) => {
          const Icon = item.icon
          return (
            <MenuItem
              key={item.label}
              onClick={() => setCreateAnchor(null)}
              sx={{ gap: 1.5, py: 1 }}
            >
              <Icon size={16} />
              <span className="text-sm">{item.label}</span>
            </MenuItem>
          )
        })}
      </Menu>

      {/* Calendar */}
      <IconButton
        label="Calendar"
        onClick={() => navigate('/calendar')}
        sx={{ border: '1px solid var(--line)', width: 40, height: 40 }}
      >
        <Calendar size={18} />
      </IconButton>

      {/* Notifications */}
      <span className="relative">
        <IconButton
          label="Notifications"
          onClick={() => navigate('/notifications')}
          sx={{ border: '1px solid var(--line)', width: 40, height: 40 }}
        >
          <Bell size={18} />
        </IconButton>
        <span className="pointer-events-none absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface" />
      </span>

      {/* Theme toggle */}
      <IconButton
        label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleMode}
        sx={{ border: '1px solid var(--line)', width: 40, height: 40 }}
      >
        {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>

      {/* Profile */}
      <ButtonBase
        onClick={(e) => setProfileAnchor(e.currentTarget)}
        aria-label="Open profile menu"
        sx={{
          borderRadius: '9999px',
          p: '2px',
          ml: 0.5,
          outline: '2px solid transparent',
          outlineOffset: '2px',
          transition: 'outline-color 0.2s',
          '&:hover': { outlineColor: 'var(--brand)' },
        }}
      >
        <Avatar
          name={user?.name}
          sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}
        />
      </ButtonBase>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 272,
              borderRadius: 3,
              overflow: 'hidden',
              border: '1px solid var(--line)',
            },
          },
        }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent px-4 py-4">
          <Avatar
            name={user?.name}
            sx={{ width: 46, height: 46, bgcolor: 'primary.main' }}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">
              {user?.name}
            </p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null)
            navigate('/profile')
          }}
          sx={{ gap: 1.5, py: 1.25 }}
        >
          <UserCircle2 size={17} />
          <span className="text-sm">View profile</span>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setProfileAnchor(null)
            logout()
            navigate('/landing')
          }}
          sx={{ gap: 1.5, py: 1.25, color: 'error.main' }}
        >
          <LogOut size={17} />
          <span className="text-sm font-medium">Sign out</span>
        </MenuItem>
      </Menu>
    </header>
  )
}
