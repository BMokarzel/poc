import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const PROJECT_META = {
  backend: {
    icon: '⚙️',
    description: 'APIs REST, microsserviços NestJS, MongoDB e observabilidade.',
  },
  ios: {
    icon: '🍎',
    description: 'Aplicativos nativos iOS com Swift e UIKit / SwiftUI.',
  },
  android: {
    icon: '🤖',
    description: 'Aplicativos nativos Android com Kotlin e Jetpack.',
  },
  react: {
    icon: '⚛️',
    description: 'Interfaces web modernas com React, hooks e gerenciamento de estado.',
  },
  'react-native': {
    icon: '📱',
    description: 'Apps cross-platform com React Native e Expo.',
  },
}

export default function HomePage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    api.projects.list().then(setProjects).catch(() => {})
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-navy dark:text-white mb-3">
          Trailblazers Onboarding
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Escolha um projeto para ver as tasks disponíveis.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(({ id, label, taskCount }) => {
          const meta = PROJECT_META[id] || { icon: '📦', description: '' }
          return (
            <button
              key={id}
              onClick={() => navigate(`/tasks/${id}`)}
              className="group text-left rounded-2xl border border-slate-200 dark:border-navy-light
                         bg-white dark:bg-navy-mid p-6 shadow-sm
                         hover:border-primary hover:shadow-md
                         dark:hover:border-primary transition-all duration-200"
            >
              <div className="text-4xl mb-4">{meta.icon}</div>
              <h2 className="font-display text-lg font-semibold text-navy dark:text-white mb-1 group-hover:text-primary transition-colors">
                {label}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                {meta.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                <span className="w-2 h-2 rounded-full bg-primary/60" />
                {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
