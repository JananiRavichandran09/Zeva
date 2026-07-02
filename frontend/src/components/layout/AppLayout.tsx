import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex h-full w-full bg-canvas text-fg">
      <Sidebar />

      {/* Main content column */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <div className="min-h-0 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
