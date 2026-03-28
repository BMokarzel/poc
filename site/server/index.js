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
const STATUS_FILE = path.join(TASKS_DIR, 'status.json')
const app = express()
app.use(cors())
app.use(express.json())

// --- helpers ---

function readStatus() {
  try {
    return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeStatus(data) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2))
}

function parseTasks() {
  const statuses = readStatus()
  const files = fs.readdirSync(TASKS_DIR).filter(f => /^T-\d+.*\.md$/.test(f))

  return files.map(file => {
    const raw = fs.readFileSync(path.join(TASKS_DIR, file), 'utf8')
    const { data: frontmatter, content } = matter(raw)

    // Parse sections from markdown content
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
      status: statuses[frontmatter.id] || 'todo',
      sections,
    }
  })
}

// --- routes ---

app.get('/api/tasks', (_req, res) => {
  try {
    res.json(parseTasks())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/tasks/:id', (req, res) => {
  try {
    const tasks = parseTasks()
    const task = tasks.find(t => t.id === req.params.id)
    if (!task) return res.status(404).json({ error: 'Not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body
  const valid = ['todo', 'in_progress', 'done']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const statuses = readStatus()
  statuses[req.params.id] = status
  writeStatus(statuses)
  res.json({ id: req.params.id, status })
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
