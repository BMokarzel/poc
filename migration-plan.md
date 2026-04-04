# Migration Plan: Task files → Unified JSON + TypeScript contract

## Objetivo

Unificar os arquivos de task (`.md` + `criteria/*.eval.json` + `status.json`) em um único `T-NNN.json` por task, criar um contrato TypeScript como fonte da verdade e atualizar server e evaluate para o novo formato.

---

## Decisão pendente: nome do diretório oculto

`types/`, `templates/`, `evaluate/` e `tasks/person/` serão agrupados em um diretório oculto (prefixo `.`) na raiz. Opções:

| Nome | Característica |
|---|---|
| `.trailblazers/` | específico do projeto, autodescritivo |
| `.onboarding/` | descreve o propósito |
| `.eval/` | curto, direto ao ponto |
| `.system/` | genérico, mas claro |

> Substituir `{HIDDEN_DIR}` abaixo pelo nome escolhido antes de executar.

---

## Estrutura final

```
/
├── {HIDDEN_DIR}/                  ← oculto (ex: .trailblazers)
│   ├── types/
│   │   └── index.ts               ← contrato TypeScript (novo)
│   ├── templates/
│   │   └── task.template.json     ← exemplo preenchido baseado nos types
│   ├── evaluate/
│   │   ├── run.js                 ← atualizado para ler .json
│   │   └── prompts/
│   │       └── evaluator.prompt.md
│   └── person/                    ← movido de tasks/person/
│       ├── person.json
│       └── study/
│           └── plan.json
│
├── backend/tasks/
│   ├── T-001.json                 ← unificado (era .md + criteria/T-001.eval.json)
│   ├── T-002.json
│   ├── T-003.json
│   ├── T-004.json
│   ├── T-005.json
│   └── T-006.json
│   ✗ T-001.md ... T-006.md        ← removidos
│   ✗ status.json                  ← removido (status vai para cada task)
│   ✗ criteria/                    ← removida (criteria vai para cada task)
│
├── site/server/index.js           ← atualizado para ler .json
└── tasks/                         ← esvaziado e removido ao final
```

---

## Passo 1 — Criar diretório oculto e mover arquivos existentes

```bash
mkdir -p {HIDDEN_DIR}/types
mkdir -p {HIDDEN_DIR}/templates
mkdir -p {HIDDEN_DIR}/person

# mover evaluate (já existe na raiz)
mv evaluate/ {HIDDEN_DIR}/evaluate/

# mover templates (já existe na raiz)
mv templates/ {HIDDEN_DIR}/templates/

# mover person
mv tasks/person/ {HIDDEN_DIR}/person/

# remover tasks/ se estiver vazio
rmdir tasks/
```

Atualizar referências de path em `site/server/index.js`:
```diff
- const PERSON_FILE = path.join(ROOT, 'tasks', 'person', 'person.json')
- const PLAN_FILE   = path.join(ROOT, 'tasks', 'person', 'study', 'plan.json')
+ const PERSON_FILE = path.join(ROOT, '{HIDDEN_DIR}', 'person', 'person.json')
+ const PLAN_FILE   = path.join(ROOT, '{HIDDEN_DIR}', 'person', 'study', 'plan.json')
```

Atualizar referências de path em `{HIDDEN_DIR}/evaluate/run.js`:
```diff
- const ROOT_DIR    = path.resolve(__dirname, '..')
- const PERSON_FILE = path.join(ROOT_DIR, 'tasks', 'person', 'person.json')
- const PLAN_FILE   = path.join(ROOT_DIR, 'tasks', 'person', 'study', 'plan.json')
+ const ROOT_DIR    = path.resolve(__dirname, '../..')   // um nível a mais pelo dir oculto
+ const PERSON_FILE = path.join(__dirname, '..', 'person', 'person.json')
+ const PLAN_FILE   = path.join(__dirname, '..', 'person', 'study', 'plan.json')
```

---

## Passo 2 — Criar `{HIDDEN_DIR}/types/index.ts`

Criar o arquivo com o seguinte conteúdo:

```typescript
export type TaskType   = 'FEATURE' | 'BUG' | 'REFACTOR' | 'CHORE'
export type Difficulty = 'easy' | 'medium' | 'hard' | 'very-hard'
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type EvalLevel  = 'insufficient' | 'partial' | 'sufficient' | 'very_good' | 'exceptional'
export type Weight     = 'high' | 'medium' | 'low'

export interface EvalRubric {
  insufficient: string
  partial:      string
  sufficient:   string
}

export interface BaseCriterion {
  type:          'dod' | 'hidden'
  description:   string
  how_to_verify: string
  evaluation:    EvalRubric
}

export interface DodCriterion extends BaseCriterion {
  type: 'dod'
}

export interface HiddenCriterion extends BaseCriterion {
  type:      'hidden'
  weight:    Weight
  rationale: string
}

export type Criterion = DodCriterion | HiddenCriterion

export interface FunctionalCheck {
  description: string
  command:     string
}

export interface TaskCriteria {
  references: {
    pattern_file:     string | null
    functional_check: FunctionalCheck
  }
  hidden: HiddenCriterion[]
  final_evaluation: {
    rules:       Record<EvalLevel, { condition: string; description: string }>
    tiebreaker:  string
  }
  evaluator_instructions: {
    tone:                     string
    on_hidden_not_found:      string
    on_hidden_partial:        string
    on_alternative_solutions: string
    language:                 string
  }
}

export interface Task {
  id:         string           // padrão T-NNN
  name:       string
  type:       TaskType
  difficulty: Difficulty
  estimate:   string           // ex: "2h", "1d", "3d"
  services:   string[]         // ex: ["bff", "core"]
  tags:       string[]
  status:     TaskStatus

  // conteúdo visível ao dev
  context:            string         // markdown livre
  scope:              string         // markdown livre (pode ter listas aninhadas)
  tips:               string[]       // bullets planos
  out_of_scope:       string[]       // bullets planos
  definition_of_done: DodCriterion[] // descrição visível + rubrica de avaliação
  domain:             string[]       // caminhos de arquivo relevantes

  // somente evaluator — não exibido no site
  criteria: TaskCriteria
}
```

---

## Passo 3 — Migrar os 6 arquivos do backend

Para cada `T-NNN.md` + `criteria/T-NNN.eval.json` + `status.json`, criar um `T-NNN.json` unificado.

**Regras de mapeamento:**

| Origem | Destino |
|---|---|
| frontmatter `id, name, type, difficulty, estimate, services, tags` | raiz do JSON |
| `status.json["T-NNN"]` | `status` |
| seção `## Contexto` | `context` (string markdown) |
| seção `## Escopo` | `scope` (string markdown) |
| seção `## Dicas` | `tips` (array — remover `- ` de cada item) |
| seção `## Fora do escopo` | `out_of_scope` (array — remover `- `) |
| seção `## Definition of done` | base para `definition_of_done[].description` (remover `- [ ] `) |
| seção `## Domain` | `domain` (array — remover `- `) |
| `criteria/T-NNN.eval.json > dod_criteria[i].how_to_verify` | `definition_of_done[i].how_to_verify` |
| `criteria/T-NNN.eval.json > dod_criteria[i].evaluation` | `definition_of_done[i].evaluation` |
| `criteria/T-NNN.eval.json > references` | `criteria.references` |
| `criteria/T-NNN.eval.json > hidden_criteria` | `criteria.hidden` (adicionar `type: "hidden"`) |
| `criteria/T-NNN.eval.json > final_evaluation` | `criteria.final_evaluation` |
| `criteria/T-NNN.eval.json > evaluator_instructions` | `criteria.evaluator_instructions` |

**Cada `DodCriterion` no JSON final:**
```json
{
  "type": "dod",
  "description": "GET /pages?hasSection=hero retorna apenas as páginas que contêm section do tipo hero",
  "how_to_verify": "No diff, verificar se PagesController passa o query param...",
  "evaluation": {
    "insufficient": "O filtro não foi implementado...",
    "partial": "O filtro existe no service mas há bug...",
    "sufficient": "O filtro está no PagesService..."
  }
}
```

**Cada `HiddenCriterion` no JSON final:**
```json
{
  "type": "hidden",
  "weight": "high",
  "description": "Validação do query param com class-validator",
  "rationale": "Um dev que leu o projeto vai perceber que todos os DTOs usam class-validator...",
  "how_to_verify": "Verificar no diff se foi criado um DTO...",
  "evaluation": {
    "insufficient": "Nenhum DTO criado...",
    "partial": "DTO criado mas sem decorators...",
    "sufficient": "DTO com @IsOptional e @IsString criado..."
  }
}
```

Após criação de todos os `.json`, remover:
- `backend/tasks/T-001.md` ... `T-006.md`
- `backend/tasks/status.json`
- `backend/tasks/criteria/` (diretório inteiro)

---

## Passo 4 — Atualizar `site/server/index.js`

### 3a. Remover dependência `gray-matter`

```diff
- import matter from 'gray-matter'
```

### 3b. Reescrever `parseTasks`

```javascript
// antes: lia .md com gray-matter + status.json separado
// depois: lê .json diretamente

function parseTasks(project) {
  const dir = projectDir(project)
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => /^T-\d+.*\.json$/.test(f))
    .map(file => {
      const task = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
      // criteria não é enviado ao site
      const { criteria, ...public } = task
      return { ...public, project }
    })
}
```

### 3c. Reescrever `PATCH /api/tasks/:id/status`

```javascript
// antes: lia/escrevia status.json
// depois: edita o campo status dentro do T-NNN.json

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
```

### 3d. Atualizar contagem em `GET /api/projects`

```diff
- .filter(f => /^T-\d+.*\.md$/.test(f)).length
+ .filter(f => /^T-\d+.*\.json$/.test(f)).length
```

### 3e. Remover funções `readStatus` e `writeStatus`

Não são mais necessárias.

---

## Passo 5 — Atualizar `{HIDDEN_DIR}/evaluate/run.js`

### 4a. Reescrever `listTasks`

```javascript
// antes: filtrava .md
// depois: filtra .json

function listTasks(project) {
  const dir = path.join(ROOT_DIR, project, 'tasks')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => /^T-\d+.*\.json$/.test(f))
    .map(f => f.replace('.json', ''))
}
```

### 4b. Reescrever leitura de task e criteria no loop principal

```javascript
// antes: lia taskPath (.md) e criteriaPath (arquivo separado)
// depois: lê um único arquivo .json

const taskPath = path.join(ROOT_DIR, project, 'tasks', `${taskId}.json`)
if (!fs.existsSync(taskPath)) { console.error(`Task não encontrada: ${taskPath}`); continue }

const task = readJSON(taskPath)
const taskMd = buildTaskMarkdown(task)  // monta string legível para o prompt
const evalJson = {
  references:             task.criteria.references,
  dod_criteria:           task.definition_of_done,   // mesmo formato esperado pelo prompt
  hidden_criteria:        task.criteria.hidden,
  final_evaluation:       task.criteria.final_evaluation,
  evaluator_instructions: task.criteria.evaluator_instructions,
}
```

### 4c. Adicionar função `buildTaskMarkdown`

Reconstrói a representação markdown a partir do JSON para montar o prompt do evaluator:

```javascript
function buildTaskMarkdown(task) {
  const dod = task.definition_of_done.map(d => `- [ ] ${d.description}`).join('\n')
  const domain = task.domain.map(d => `- ${d}`).join('\n')
  return `# ${task.id} — ${task.name}

## Contexto
${task.context}

## Escopo
${task.scope}

## Definition of done
${dod}

## Domain
${domain}`
}
```

### 4d. Atualizar escrita de status

```javascript
// antes: escrevia em status.json
// depois: edita o campo status no .json da task

const task = readJSON(taskPath)
task.status = 'done'
fs.writeFileSync(taskPath, JSON.stringify(task, null, 2))
```

---

## Passo 6 — Atualizar `{HIDDEN_DIR}/templates/task.template.json`

Substituir o template atual por um exemplo preenchido que siga a interface `Task`, com comentários inline como `"// ..."` nos campos que precisam de explicação (ou usar um arquivo `.jsonc` se o projeto aceitar).

---

## Passo 7 — Remover `gray-matter` das dependências

```bash
cd site && npm uninstall gray-matter
```

---

## Checklist de execução

- [ ] Definir nome do diretório oculto e substituir `{HIDDEN_DIR}` no plano
- [ ] Passo 1 — Criar `{HIDDEN_DIR}/` e mover `evaluate/`, `templates/`, `tasks/person/`
- [ ] Passo 1 — Atualizar paths em `server/index.js` e `evaluate/run.js` para novo local
- [ ] Passo 2 — Criar `{HIDDEN_DIR}/types/index.ts`
- [ ] Passo 3 — Migrar 6 tasks do backend para `.json` unificado
- [ ] Passo 3 — Remover `.md`, `status.json`, `criteria/`
- [ ] Passo 4 — Atualizar `site/server/index.js` (parseTasks, PATCH status, contagem)
- [ ] Passo 5 — Atualizar `{HIDDEN_DIR}/evaluate/run.js` (listTasks, leitura unificada, buildTaskMarkdown)
- [ ] Passo 6 — Atualizar `{HIDDEN_DIR}/templates/task.template.json`
- [ ] Passo 7 — Remover `gray-matter` (`cd site && npm uninstall gray-matter`)
- [ ] Validar: `npm run dev` no site sobe sem erros
- [ ] Validar: tasks aparecem no board com status correto
- [ ] Validar: atualizar status de uma task persiste no `.json`
