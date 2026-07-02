import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
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
        <Route index element={<DashboardPage />} />
        <Route path="chat-ai" element={<ChatAIPage />} />
        <Route path="coordinator" element={<CoordinatorPage />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  )
}
