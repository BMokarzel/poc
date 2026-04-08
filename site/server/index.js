import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')
const PERSON_FILE = path.join(ROOT, '.trailblazers', 'person', 'person.json')
const PLAN_FILE = path.join(ROOT, '.trailblazers', 'person', 'study', 'plan.json')

const PROJECTS = ['backend', 'ios', 'android', 'react', 'react-native']
const PROJECT_LABELS = {
  backend: 'Backend',
  ios: 'iOS',
  android: 'Android',
  react: 'React',
  'react-native': 'React Native',
}

const app = express()
app.use(cors())
app.use(express.json())

// --- helpers ---

function projectDir(project) {
  return path.join(ROOT, project, 'tasks')
}

function parseTasks(project) {
  const dir = projectDir(project)
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => /^T-\d+.*\.json$/.test(f))
    .map(file => {
      const task = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
      // criteria não é enviado ao site
      const { criteria, ...pub } = task
      return { ...pub, project }
    })
}

// --- routes ---

app.get('/api/projects', (_req, res) => {
  try {
    const projects = PROJECTS.map(id => {
      const dir = projectDir(id)
      const taskCount = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter(f => /^T-\d+.*\.json$/.test(f)).length
        : 0
      return { id, label: PROJECT_LABELS[id], taskCount }
    })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/tasks', (req, res) => {
  try {
    const project = req.query.project || 'backend'
    res.json(parseTasks(project))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/tasks/:id', (req, res) => {
  try {
    const project = req.query.project || 'backend'
    const tasks = parseTasks(project)
    const task = tasks.find(t => t.id === req.params.id)
    if (!task) return res.status(404).json({ error: 'Not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/tasks/:id/status', (req, res) => {
  const { status, project = 'backend' } = req.body
  const valid = ['todo', 'in_progress', 'done']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const filePath = path.join(projectDir(project), `${req.params.id}.json`)
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Not found' })
  }

  const task = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  task.status = status
  fs.writeFileSync(filePath, JSON.stringify(task, null, 2))
  res.json({ id: req.params.id, status, project })
})

app.get('/api/person', (_req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PERSON_FILE, 'utf8'))
    res.json(data)
  } catch {
    res.json({})
  }
})

app.get('/api/study/plan', (_req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(PLAN_FILE, 'utf8'))
    res.json(data)
  } catch {
    res.json({ topics: [], planStatus: 'draft' })
  }
})

app.listen(3001, () => console.log('API server running on http://localhost:3001'))
