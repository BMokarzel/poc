import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import TasksPage from './pages/TasksPage'
import DashboardPage from './pages/DashboardPage'
import TechnologiesPage from './pages/TechnologiesPage'
import StudyPage from './pages/StudyPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-[#0A0A1A] text-navy dark:text-slate-100 font-body transition-colors duration-300">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:project" element={<TasksPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/technologies" element={<TechnologiesPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
