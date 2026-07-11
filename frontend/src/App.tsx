import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useFeatureFlag } from '@/app/ShellProvider'
import LandingPage from '@/pages/LandingPage'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import ChatAIPage from '@/pages/ChatAIPage'
import CoordinatorPage from '@/pages/CoordinatorPage'
import CalendarPage from '@/pages/CalendarPage'
import MeetingsPage from '@/pages/MeetingsPage'
import TasksPage from '@/pages/TasksPage'
import ProjectsPage from '@/pages/ProjectsPage'
import TeamPage from '@/pages/TeamPage'
import DocumentsPage from '@/pages/DocumentsPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import NotificationsPage from '@/pages/NotificationsPage'
import SettingsPage from '@/pages/SettingsPage'
import ProfilePage from '@/pages/ProfilePage'
import type { ReactNode } from 'react'

/** Route guard: renders children only if the feature flag is enabled, otherwise redirects to / */
function FeatureRoute({ flag, children }: { flag: string; children: ReactNode }) {
  const enabled = useFeatureFlag(flag)
  if (!enabled) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard is always available */}
        <Route index element={<DashboardPage />} />

        {/* Feature-flagged routes */}
        <Route path="chat-ai" element={<FeatureRoute flag="zeva.chat_ai"><ChatAIPage /></FeatureRoute>} />
        <Route path="coordinator" element={<FeatureRoute flag="zeva.coordinator"><CoordinatorPage /></FeatureRoute>} />
        <Route path="calendar" element={<FeatureRoute flag="zeva.calendar"><CalendarPage /></FeatureRoute>} />
        <Route path="meetings" element={<FeatureRoute flag="zeva.meetings"><MeetingsPage /></FeatureRoute>} />
        <Route path="tasks" element={<FeatureRoute flag="zeva.tasks"><TasksPage /></FeatureRoute>} />
        <Route path="projects" element={<FeatureRoute flag="zeva.projects"><ProjectsPage /></FeatureRoute>} />
        <Route path="team" element={<FeatureRoute flag="zeva.team"><TeamPage /></FeatureRoute>} />
        <Route path="documents" element={<FeatureRoute flag="zeva.documents"><DocumentsPage /></FeatureRoute>} />
        <Route path="analytics" element={<FeatureRoute flag="zeva.analytics"><AnalyticsPage /></FeatureRoute>} />
        <Route path="notifications" element={<FeatureRoute flag="zeva.notifications"><NotificationsPage /></FeatureRoute>} />
        <Route path="settings" element={<FeatureRoute flag="zeva.settings"><SettingsPage /></FeatureRoute>} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}
