#!/usr/bin/env node
/**
 * evaluate/run.js
 *
 * CLI interativo para montar e executar a avaliação de tasks.
 * Uso: node tasks/evaluate/run.js
 *
 * Se ANTHROPIC_API_KEY estiver no ambiente, chama a API diretamente.
 * Caso contrário, imprime o prompt montado para uso manual.
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TASKS_DIR = path.resolve(__dirname, '..')
const PROMPT_FILE = path.join(__dirname, 'prompts', 'evaluator.prompt.md')
const PERSON_FILE = path.join(TASKS_DIR, 'person', 'person.json')
const PLAN_FILE = path.join(TASKS_DIR, 'person', 'study', 'plan.json')
const REPORTS_DIR = path.join(__dirname, 'reports')

const PROJECTS = ['backend', 'ios', 'android', 'react', 'react-native']

// --- readline helpers ---

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve))
}

function askList(question, options) {
  return new Promise(resolve => {
    console.log(`\n${question}`)
    options.forEach((opt, i) => console.log(`  ${i + 1}. ${opt}`))
    rl.question('  Escolha (número ou números separados por vírgula): ', answer => {
      const indices = answer.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(i => i >= 0 && i < options.length)
      resolve(indices.map(i => options[i]))
    })
  })
}

// --- file helpers ---

function readJSON(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')) }
  catch { return null }
}

function readText(filePath) {
  try { return fs.readFileSync(filePath, 'utf8') }
  catch { return '' }
}

function listTasks(project) {
  const dir = path.join(TASKS_DIR, project)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => /^T-\d+.*\.md$/.test(f))
    .map(f => f.replace('.md', ''))
}

// --- git helpers ---

function getGitDiff() {
  try { return execSync('git diff HEAD', { encoding: 'utf8', cwd: path.resolve(TASKS_DIR, '..') }) }
  catch { return '' }
}

function getTestOutput(project) {
  const projectRoot = path.resolve(TASKS_DIR, '..', project === 'backend' ? 'backend' : project)
  try {
    return execSync('npm test -- --json 2>&1 || true', { encoding: 'utf8', cwd: projectRoot, timeout: 60000 })
  } catch {
    return ''
  }
}

// --- prompt assembly ---

function assemblePrompt(promptTemplate, vars) {
  let result = promptTemplate
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value ?? '')
  }
  return result
}

// --- profile update ---

function applyProfileUpdate(profileUpdate, taskId) {
  const person = readJSON(PERSON_FILE) || {}

  if (profileUpdate.skillDelta) {
    const { technology, delta } = profileUpdate.skillDelta
    if (!person.skills) person.skills = { scores: {} }
    if (!person.skills.scores) person.skills.scores = {}
    const current = person.skills.scores[technology] ?? 5
    person.skills.scores[technology] = Math.max(0, Math.min(10, current + delta))
  }

  if (profileUpdate.patterns?.length) {
    if (!person.patterns) person.patterns = []
    profileUpdate.patterns.forEach(p => {
      const existing = person.patterns.find(e => e.pattern === p.pattern)
      if (existing) {
        existing.status = p.status
        existing.lastSeenAt = taskId
      } else {
        person.patterns.push({ ...p, firstSeenAt: taskId, lastSeenAt: taskId })
      }
    })
  }

  if (profileUpdate.strengthsUpdate?.length) {
    if (!person.strengths) person.strengths = []
    profileUpdate.strengthsUpdate.forEach(s => {
      if (!person.strengths.includes(s)) person.strengths.push(s)
    })
  }

  if (profileUpdate.improvementAreasUpdate?.length) {
    if (!person.improvementAreas) person.improvementAreas = []
    profileUpdate.improvementAreasUpdate.forEach(a => {
      if (!person.improvementAreas.includes(a)) person.improvementAreas.push(a)
    })
  }

  if (!person.meta) person.meta = {}
  person.meta.lastUpdatedAt = new Date().toISOString()
  person.meta.lastUpdatedBy = 'evaluator'

  fs.writeFileSync(PERSON_FILE, JSON.stringify(person, null, 2))
}

function appendEvaluationHistory(taskId, evaluationResult) {
  const person = readJSON(PERSON_FILE) || {}
  if (!person.evaluationHistory) person.evaluationHistory = []
  person.evaluationHistory.push({
    taskId,
    evaluatedAt: new Date().toISOString(),
    finalLevel: evaluationResult.finalLevel,
    highlights: {
      strengths: evaluationResult.strengths,
      mainFeedback: evaluationResult.mainFeedback,
    },
  })
  fs.writeFileSync(PERSON_FILE, JSON.stringify(person, null, 2))
}

function saveStudyPlan(plan) {
  const planDir = path.dirname(PLAN_FILE)
  if (!fs.existsSync(planDir)) fs.mkdirSync(planDir, { recursive: true })

  // Archive existing plan
  if (fs.existsSync(PLAN_FILE)) {
    if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })
    const ts = new Date().toISOString().replace(/[:.]/g, '-')
    fs.renameSync(PLAN_FILE, path.join(REPORTS_DIR, `plan-archived-${ts}.json`))
  }

  fs.writeFileSync(PLAN_FILE, JSON.stringify(plan, null, 2))
}

function saveReport(taskId, result) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  fs.writeFileSync(path.join(REPORTS_DIR, `${taskId}-${ts}.json`), JSON.stringify(result, null, 2))
}

// --- Claude API call ---

async function callClaudeAPI(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const body = JSON.stringify({
    model: 'claude-opus-4-6',
    max_tokens: 8192,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body,
  })

  if (!res.ok) throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return data.content[0].text
}

// --- main ---

async function main() {
  console.log('\n╔════════════════════════════════╗')
  console.log('║   Trailblazers — Evaluator CLI  ║')
  console.log('╚════════════════════════════════╝\n')

  // 1. Select projects
  const selectedProjects = await askList('Qual(is) projeto(s) deseja avaliar?', PROJECTS)
  if (!selectedProjects.length) { console.log('Nenhum projeto selecionado.'); rl.close(); return }

  // 2. For each project, select tasks
  const evaluationTargets = []
  for (const project of selectedProjects) {
    const available = listTasks(project)
    if (!available.length) {
      console.log(`\n  [${project}] Nenhuma task encontrada. Pulando.`)
      continue
    }
    const selected = await askList(`Tasks disponíveis em [${project}]:`, available)
    selected.forEach(taskId => evaluationTargets.push({ project, taskId }))
  }

  if (!evaluationTargets.length) { console.log('\nNenhuma task selecionada.'); rl.close(); return }

  // 3. Collect shared context once
  console.log('\n📦 Coletando contexto do repositório...')
  const gitDiff = getGitDiff()
  const promptTemplate = readText(PROMPT_FILE)
  const personJson = readJSON(PERSON_FILE)

  if (!promptTemplate) { console.error('Erro: prompt template não encontrado em', PROMPT_FILE); rl.close(); return }

  // 4. Evaluate each target
  for (const { project, taskId } of evaluationTargets) {
    console.log(`\n${'─'.repeat(50)}`)
    console.log(`▶  Avaliando ${taskId} [${project}]`)
    console.log('─'.repeat(50))

    const taskPath = path.join(TASKS_DIR, project, `${taskId}.md`)
    const criteriaPath = path.join(TASKS_DIR, project, 'criteria', `${taskId}.eval.json`)

    if (!fs.existsSync(taskPath)) { console.error(`  Task não encontrada: ${taskPath}`); continue }
    if (!fs.existsSync(criteriaPath)) { console.error(`  Critério não encontrado: ${criteriaPath}`); continue }

    const taskMd = readText(taskPath)
    const evalJson = readJSON(criteriaPath)

    // Functional check
    let funcCheckStatus = 'not_run'
    let funcCheckOutput = ''
    if (evalJson?.references?.functional_check?.command) {
      console.log(`\n  Executando functional check: ${evalJson.references.functional_check.command}`)
      const run = await ask('  Executar agora? (s/N) ')
      if (run.toLowerCase() === 's') {
        try {
          funcCheckOutput = execSync(evalJson.references.functional_check.command, {
            encoding: 'utf8', cwd: path.resolve(TASKS_DIR, '..'), timeout: 120000,
          })
          funcCheckStatus = 'passed'
        } catch (e) {
          funcCheckOutput = e.stdout || e.message
          funcCheckStatus = 'failed'
        }
      }
    }

    // Test results
    console.log('\n  Coletando resultados de testes (pode levar alguns segundos)...')
    const testOutput = getTestOutput(project)

    // Pattern file
    let patternContent = ''
    if (evalJson?.references?.pattern_file) {
      const pf = path.resolve(TASKS_DIR, evalJson.references.pattern_file)
      patternContent = readText(pf)
    }

    // Assemble prompt
    const fullPrompt = assemblePrompt(promptTemplate, {
      PROFILE_JSON: JSON.stringify(personJson, null, 2),
      TASK_ID: taskId,
      TASK_MD_CONTENT: taskMd,
      EVAL_JSON_CONTENT: JSON.stringify(evalJson, null, 2),
      PATTERN_FILE_CONTENT: patternContent,
      FUNCTIONAL_CHECK_STATUS: funcCheckStatus,
      FUNCTIONAL_CHECK_OUTPUT: funcCheckOutput,
      GIT_DIFF: gitDiff,
      TEST_OUTPUT_JSON: testOutput,
    })

    // Split system/user from template
    const systemMatch = promptTemplate.match(/## System prompt — fixo\n+```\n([\s\S]*?)```/)
    const userMatch = promptTemplate.match(/## User prompt — montado dinamicamente pelo CLI\n+```\n([\s\S]*?)```/)
    const systemPrompt = systemMatch ? systemMatch[1].trim() : ''
    const userPromptTemplate = userMatch ? userMatch[1].trim() : ''
    const userPrompt = assemblePrompt(userPromptTemplate, {
      PROFILE_JSON: JSON.stringify(personJson, null, 2),
      TASK_ID: taskId,
      TASK_MD_CONTENT: taskMd,
      EVAL_JSON_CONTENT: JSON.stringify(evalJson, null, 2),
      PATTERN_FILE_CONTENT: patternContent,
      FUNCTIONAL_CHECK_STATUS: funcCheckStatus,
      FUNCTIONAL_CHECK_OUTPUT: funcCheckOutput,
      GIT_DIFF: gitDiff,
      TEST_OUTPUT_JSON: testOutput,
    })

    if (process.env.ANTHROPIC_API_KEY) {
      console.log('\n  🤖 Chamando Claude API...')
      try {
        const responseText = await callClaudeAPI(systemPrompt, userPrompt)
        const result = JSON.parse(responseText)

        saveReport(taskId, result)
        console.log(`\n  ✅ Nível final: ${result.finalLevel}`)
        console.log(`  📝 ${result.mainFeedback?.slice(0, 120)}...`)

        applyProfileUpdate(result.profileUpdate, taskId)
        appendEvaluationHistory(taskId, result)

        if (result.studyPlanUpdate?.shouldGenerate && result.studyPlanUpdate?.plan) {
          saveStudyPlan(result.studyPlanUpdate.plan)
          console.log('  📚 Plano de estudos gerado em tasks/person/study/plan.json')
        }

        // Update status to done
        const statusPath = path.join(TASKS_DIR, project, 'status.json')
        const statuses = readJSON(statusPath) || {}
        statuses[taskId] = 'done'
        fs.writeFileSync(statusPath, JSON.stringify(statuses, null, 2))

        console.log(`\n  Relatório salvo em evaluate/reports/${taskId}-*.json`)
      } catch (err) {
        console.error('  Erro ao chamar a API ou processar resposta:', err.message)
        console.log('\n  Prompt montado (cole manualmente no Claude):\n')
        console.log('─'.repeat(50))
        console.log(fullPrompt)
      }
    } else {
      console.log('\n  ⚠️  ANTHROPIC_API_KEY não configurada.')
      console.log('  Prompt montado abaixo — cole no Claude para obter a avaliação:\n')
      console.log('─'.repeat(50))
      console.log(fullPrompt)
      console.log('─'.repeat(50))

      const save = await ask('\n  Salvar prompt em arquivo? (s/N) ')
      if (save.toLowerCase() === 's') {
        if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true })
        const ts = new Date().toISOString().replace(/[:.]/g, '-')
        const outFile = path.join(REPORTS_DIR, `${taskId}-prompt-${ts}.txt`)
        fs.writeFileSync(outFile, fullPrompt)
        console.log(`  Salvo em: ${outFile}`)
      }
    }
  }

  console.log('\n✅ Avaliação concluída.\n')
  rl.close()
}

main().catch(err => { console.error(err); rl.close(); process.exit(1) })
