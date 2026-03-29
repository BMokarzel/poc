import express from 'express'
import cors from 'cors'
import matter from 'gray-matter'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../')
const TASKS_DIR = path.join(ROOT, 'tasks')
const PERSON_FILE = path.join(TASKS_DIR, 'person', 'person.json')
const PLAN_FILE = path.join(TASKS_DIR, 'person', 'study', 'plan.json')

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
  return path.join(TASKS_DIR, project)
}

function readStatus(project) {
  try {
    return JSON.parse(fs.readFileSync(path.join(projectDir(project), 'status.json'), 'utf8'))
  } catch {
    return {}
  }
}

function writeStatus(project, data) {
  fs.writeFileSync(path.join(projectDir(project), 'status.json'), JSON.stringify(data, null, 2))
}

function parseTasks(project) {
  const dir = projectDir(project)
  if (!fs.existsSync(dir)) return []

  const statuses = readStatus(project)
  const files = fs.readdirSync(dir).filter(f => /^T-\d+.*\.md$/.test(f))

  return files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data: frontmatter, content } = matter(raw)

    const sections = {}
    const sectionRegex = /^## (.+)$/gm
    let match
    const sectionStarts = []

    while ((match = sectionRegex.exec(content)) !== null) {
      sectionStarts.push({ title: match[1], index: match.index })
    }

    sectionStarts.forEach((sec, i) => {
      const start = content.indexOf('\n', sec.index) + 1
      const end = i + 1 < sectionStarts.length ? sectionStarts[i + 1].index : content.length
      sections[sec.title] = content.slice(start, end).trim()
    })

    return {
      ...frontmatter,
      id: frontmatter.id || file.replace('.md', ''),
      project,
      status: statuses[frontmatter.id] || 'todo',
      sections,
    }
  })
}

// --- routes ---

app.get('/api/projects', (_req, res) => {
  try {
    const projects = PROJECTS.map(id => {
      const dir = projectDir(id)
      const taskCount = fs.existsSync(dir)
        ? fs.readdirSync(dir).filter(f => /^T-\d+.*\.md$/.test(f)).length
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
  const statuses = readStatus(project)
  statuses[req.params.id] = status
  writeStatus(project, statuses)
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
