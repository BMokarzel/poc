import { NavLink } from 'react-router-dom'
import ThemeToggle from '../ui/ThemeToggle'
import LogoImage from '../ui/LogoImage'

const LINKS = [
  { to: '/',             label: 'Home',         end: true },
  { to: '/tasks',        label: 'Tasks' },
  { to: '/dashboard',    label: 'Dashboard' },
  { to: '/technologies', label: 'Technologies' },
  { to: '/study',        label: 'Study' },
]

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-[#0A0A1A]/90 backdrop-blur border-b border-slate-100 dark:border-navy-light">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <LogoImage className="h-8" />
          <div className="hidden sm:block">
            <p className="font-display text-sm leading-none text-navy dark:text-white">Trailblazer</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Onboarding</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
