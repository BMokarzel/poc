import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="relative w-12 h-6 rounded-full border border-slate-200 dark:border-navy-light
                 bg-slate-100 dark:bg-navy-mid transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 flex items-center justify-center text-xs
          ${dark ? 'translate-x-6 bg-primary' : 'translate-x-0 bg-white shadow'}`}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
