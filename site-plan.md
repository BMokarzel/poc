# Site Implementation Plan
## Trailblazer Onboarding — Local Dashboard

---

## 1. Visão geral

Aplicação web local que consome os arquivos JSON do projeto (`tasks/`, `person/`, `study/`)
e oferece visualização de tasks, dashboard de progresso, mapa de tecnologias e plano de estudos.
Roda 100% local. Nenhuma dependência de rede em runtime.

---

## 2. Stack técnica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| Frontend | React 18 + Vite | HMR, imports nativos de JSON, build simples |
| Roteamento | React Router v6 | SPA com 4 rotas principais |
| Gráficos | Recharts | Componentes React nativos, fácil de estilizar com CSS vars |
| Estilo | Tailwind CSS + CSS custom properties | Dark/Light via `.dark` class no root |
| Tipografia | PP Fragmente Glare + DM Sans | Fontes locais ou Google Fonts (DM Sans) |
| API local | Express (Node.js) | Leitura e escrita de arquivos JSON do projeto |
| Dev runner | concurrently | Sobe frontend (5173) e backend (3001) com `npm run dev` |
| Dependências de chart | recharts | radar, donut (pie), bar stacked |

---

## 3. Estrutura de pastas

```
poc/
├── site/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   │
│   ├── server/
│   │   └── index.js              # Express API — lê e escreve arquivos do projeto
│   │
│   ├── public/
│   │   └── ref/                  # Symlink ou cópia de ../ref/ (logos, gifs, ícones)
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx               # Router + ThemeProvider
│       │
│       ├── styles/
│       │   ├── globals.css       # CSS custom properties (paleta, tipografia, tema)
│       │   └── fonts.css         # @font-face PP Fragmente Glare
│       │
│       ├── lib/
│       │   ├── api.js            # Funções fetch para o Express server
│       │   └── utils.js          # Formatadores, helpers de data, etc.
│       │
│       ├── hooks/
│       │   ├── useTasks.js       # Carrega e atualiza tasks
│       │   ├── usePerson.js      # Carrega profile do dev
│       │   └── useStudyPlan.js   # Carrega plan.json
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.jsx        # Dashboard | Tasks | Technologies | Study + toggle dark
│       │   │   └── LoadingScreen.jsx # Overlay com logo animado + progress bar
│       │   │
│       │   ├── ui/
│       │   │   ├── Card.jsx          # Container base de card
│       │   │   ├── Badge.jsx         # Status badge (todo/in_progress/done, níveis)
│       │   │   └── ThemeToggle.jsx   # Botão light/dark
│       │   │
│       │   ├── tasks/
│       │   │   ├── TaskBoard.jsx     # Grid de TaskCards
│       │   │   ├── TaskCard.jsx      # Card colapsável com status visível
│       │   │   ├── TaskFilters.jsx   # Filtros por tecnologia, tipo, nome, status
│       │   │   └── TaskDetail.jsx    # Conteúdo expandido (contexto, escopo, DoD, dicas)
│       │   │
│       │   ├── dashboard/
│       │   │   ├── RadarCard.jsx     # Card 1 — radar chart de skills
│       │   │   ├── TaskProgressCard.jsx  # Card 2 — donut de conclusão de tasks
│       │   │   ├── QualityCard.jsx   # Card 3 — donut de níveis de avaliação
│       │   │   └── ErrorsCard.jsx    # Card 4 — bar chart empilhado de erros
│       │   │
│       │   ├── technologies/
│       │   │   ├── TechGrid.jsx      # Grid de TechCards
│       │   │   └── TechCard.jsx      # Card expandível com descrição da tecnologia
│       │   │
│       │   └── study/
│       │       ├── StudyTimeline.jsx # Timeline vertical de tópicos
│       │       ├── TopicNode.jsx     # Nó da timeline (colapsável, com duração visual)
│       │       └── TopicDetail.jsx   # Referências, objetivos, milestones
│       │
│       └── pages/
│           ├── TasksPage.jsx
│           ├── DashboardPage.jsx
│           ├── TechnologiesPage.jsx
│           └── StudyPage.jsx
```

---

## 4. API local (Express)

O servidor Express roda na porta 3001 e expõe endpoints simples que lêem e escrevem
os arquivos JSON do projeto. O frontend nunca acessa o sistema de arquivos diretamente.

```
GET  /api/tasks           → lista todos os arquivos T-*.md parseados
GET  /api/tasks/:id       → task individual
PATCH /api/tasks/:id/status  → { status: "todo | in_progress | done" }
                               salva no frontmatter do .md correspondente

GET  /api/person          → lê tasks/person/person.json
GET  /api/study/plan      → lê tasks/person/study/plan.json

GET  /api/technologies    → retorna lista estática (hardcoded no server ou JSON separado)
```

O PATCH de status é a única operação de escrita do site. O restante é somente leitura.

---

## 5. Páginas — comportamento detalhado

### 5.1 Loading Screen

- Overlay sobre a tela de tasks (não é uma rota separada)
- Exibido enquanto `useTasks` estiver carregando
- Conteúdo:
  - Logo animado: `ref/GIF/Copy of _ANIMATED LOGO DARK RED.gif` (dark) /
    `Copy of _ANIMATED LOGO LIGHT BLUE.gif` (light)
  - Título: **Trailblazer Team** (PP Fragmente Glare, grande)
  - Subtítulo: **Onboarding Project** (DM Sans, menor)
  - Barra de loading animada com cor primária `#FA5A50`
- Desaparece com fade-out quando os dados estiverem prontos

### 5.2 Tasks (rota `/`)

- **Filtros** (topo): por tecnologia (multi-select chips), tipo (BUG/FEATURE/etc.), nome (input texto), status (todo/in_progress/done)
- **Grid** de TaskCards responsivo
- **TaskCard**:
  - Estado minimizado: id, nome, badge de tipo, badge de status, badge de difficulty
  - Estado expandido (click): + contexto, escopo, dicas, fora do escopo, DoD, domain
  - Click novamente: recolhe
  - Badge de status é clicável: cicla `todo → in_progress → done`; chama `PATCH /api/tasks/:id/status`
  - Animação suave de expand/collapse (CSS transition height)

### 5.3 Dashboard (rota `/dashboard`)

Layout de 2 colunas × 2 linhas. Cada célula ocupa metade da largura:

```
┌──────────────────────────────┬───────────────────┬───────────────────┐
│                              │                   │                   │
│   Card 1 — Radar (skills)    │  Card 2 — Donut   │  Card 3 — Donut   │
│   (ocupa 2 colunas)          │  task completion  │  quality levels   │
│                              │                   │                   │
├──────────────────────────────┴───────────────────┴───────────────────┤
│                                                                       │
│   Card 4 — Bar chart de erros (ocupa linha inteira)                   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Card 1 — Radar de Skills**
- Dados: `person.skills.scores` (8 eixos: JS, Node, Nest, OTel, Honeycomb, Splunk, MongoDB, Redis)
- Recharts `<RadarChart>` com área preenchida em `#FA5A50` com 40% de opacidade
- Fundo do card em destaque por ser o maior
- Label de cada eixo com o nome da tecnologia

**Card 2 — Donut: conclusão de tasks**
- Dados calculados a partir dos status das tasks
- 3 fatias: `done` (#A63832), `in_progress` (#FA8982), `todo` (#B4DCFA)
- Furo central: porcentagem total de done (ex: `42%`)
- Legenda abaixo do gráfico

**Card 3 — Donut: qualidade das avaliações**
- Dados: `person.evaluationHistory` agrupado por `finalLevel`
- Mapeamento de cor:
  - `insufficient` → `#690037`
  - `partial` → `#802655`
  - `sufficient` → `#FA8982`
  - `very_good` → `#FA5A50`
  - `exceptional` → `#D94A41`
- Furo central: % de `exceptional`
- Somente tasks com avaliação aparecem aqui

**Card 4 — Bar stacked: distribuição de erros**
- Dados: `person.patterns` onde `type === "negative"` e `status === "active"`,
  agrupados por categoria inferida da `technology` do pattern
- Eixo X: tecnologias; eixo Y: contagem de ocorrências
- Cores das barras: mesma paleta das tecnologias (ver seção 7)
- Tooltip mostra lista de padrões ao hover

### 5.4 Technologies (rota `/technologies`)

- Grid de cards, um por tecnologia
- Tecnologias iniciais: JavaScript, Node.js, NestJS, OpenTelemetry, Honeycomb, Splunk, MongoDB, Redis
- Cada card tem: ícone (usar ícones de `ref/PNG/COLOR/`), nome, cor de destaque própria (ver seção 7)
- Click abre painel lateral ou modal com:
  - Breve descrição do papel da tecnologia na stack da empresa
  - Link para documentação oficial
  - Tasks relacionadas (que têm aquela tech nos `services` ou `tags`)

### 5.5 Study (rota `/study`)

- Carrega `tasks/person/study/plan.json`
- Se `planStatus === "draft"` e `topics` vazio: estado vazio com mensagem
  "Nenhum plano de estudos gerado ainda. Complete tasks para gerar um plano."
- **Timeline vertical**:
  - Linha central conectando todos os tópicos
  - Cada `TopicNode` tem:
    - Posição na linha proporcional à `timeline.startWeek`
    - Barra lateral de cor indicando `priority` (high=#D94A41, medium=#FA5A50, low=#FA8982)
    - Altura visual proporcional a `timeline.durationDays`
    - Badge de `completionStatus`
    - Label de duração (ex: "7 dias", "2 semanas")
  - Click no nó expande `TopicDetail`:
    - Objetivos (lista)
    - Referências com tipo, tempo estimado e nota
    - Milestones com tipo e descrição
  - Click novamente recolhe
- Overview semanal (mini-calendário no topo): chips por semana com os tópicos daquela semana

---

## 6. Design System

### Paleta

```css
:root {
  /* Primary */
  --color-primary:        #FA5A50;
  --color-primary-light:  #FA8982;
  --color-primary-xlight: #FAB8B4;
  --color-primary-dark:   #D94A41;
  --color-primary-xdark:  #A63832;

  /* Secondary (purple) */
  --color-secondary-dark:   #690037;
  --color-secondary:        #802655;
  --color-secondary-light:  #994D74;
  --color-secondary-xlight: #FAB9FF;
  --color-secondary-mid:    #C785CC;
  --color-secondary-muted:  #A26CA6;

  /* Navy */
  --color-navy:       #000050;
  --color-navy-mid:   #242459;
  --color-navy-light: #393973;

  /* Blue */
  --color-blue-light:  #B4DCFA;
  --color-blue-mid:    #8CB3D9;
  --color-blue-muted:  #6B8FB3;

  /* Surface (light mode) */
  --color-bg:          #FFFFFF;
  --color-surface:     #F5F5F7;
  --color-surface-alt: #EAEAEF;
  --color-border:      #E0E0E8;
  --color-text:        #000050;
  --color-text-muted:  #393973;
}

.dark {
  --color-bg:          #0A0A1A;
  --color-surface:     #14142B;
  --color-surface-alt: #1E1E38;
  --color-border:      #2A2A4A;
  --color-text:        #F0F0FF;
  --color-text-muted:  #B4DCFA;
}
```

### Tipografia

```css
/* PP Fragmente Glare — títulos, headings, badges de destaque */
@font-face {
  font-family: 'PP Fragmente Glare';
  src: url('/fonts/PPFragmenteGlare-Regular.woff2') format('woff2');
}

/* DM Sans — corpo, labels, textos de interface */
/* Carregada via Google Fonts: https://fonts.google.com/specimen/DM+Sans */
```

### Cores por tecnologia (para cards de tech e charts)

| Tecnologia | Cor |
|------------|-----|
| JavaScript | #FAB8B4 |
| Node.js | #FA8982 |
| NestJS | #D94A41 |
| OpenTelemetry | #802655 |
| Honeycomb | #FAB9FF |
| Splunk | #C785CC |
| MongoDB | #B4DCFA |
| Redis | #8CB3D9 |

### Dark/Light toggle

- Botão no Navbar, canto direito
- Toggle adiciona/remove classe `.dark` no `<html>`
- Preferência salva em `localStorage`
- Ícones: `ref/PNG/BLACK/Copy of Icon_Moon_Black.png` (dark) e `Icon_Sun_Black.png` (light)

---

## 7. Fluxo de dados

```
Express server (porta 3001)
    │
    ├── GET /api/tasks
    │     └── lê tasks/T-*.md → parseia frontmatter YAML + markdown
    │         → retorna array de tasks com campos: id, name, type, difficulty,
    │           status (lido de tasks/status.json ou embutido no frontmatter),
    │           services, tags, sections (contexto, escopo, dod, dicas, domain)
    │
    ├── PATCH /api/tasks/:id/status
    │     └── atualiza campo status no frontmatter do .md
    │         (gray-matter para ler/escrever frontmatter YAML)
    │
    ├── GET /api/person
    │     └── lê tasks/person/person.json → retorna objeto person
    │
    └── GET /api/study/plan
          └── lê tasks/person/study/plan.json → retorna objeto plan

React frontend (porta 5173)
    │
    ├── useTasks()       → GET /api/tasks + PATCH /api/tasks/:id/status
    ├── usePerson()      → GET /api/person
    └── useStudyPlan()   → GET /api/study/plan
```

---

## 8. Dependências (package.json)

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "recharts": "^2"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "tailwindcss": "^3",
    "autoprefixer": "^10",
    "postcss": "^8",
    "concurrently": "^8",
    "express": "^4",
    "gray-matter": "^4",
    "cors": "^2"
  },
  "scripts": {
    "dev": "concurrently \"vite\" \"node server/index.js\"",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 9. Ordem de implementação

### Fase 1 — Fundação (sem dados reais ainda)
1. Setup: `npm create vite@latest site -- --template react`
2. Instalar dependências
3. Configurar Tailwind + CSS custom properties (paleta completa)
4. Configurar Google Fonts (DM Sans) + PP Fragmente Glare local
5. Criar `Navbar` com rotas e toggle de tema
6. Criar `LoadingScreen` com logo animado e progress bar
7. Criar `App.jsx` com React Router (4 rotas)

### Fase 2 — API local
8. Criar `server/index.js` com Express
9. Implementar `GET /api/tasks` com parser de frontmatter (gray-matter)
10. Implementar `PATCH /api/tasks/:id/status`
11. Implementar `GET /api/person` e `GET /api/study/plan`
12. Testar endpoints com curl/Insomnia

### Fase 3 — Página de Tasks
13. Criar `useTasks` hook
14. Criar `TaskCard` (minimizado + expandido + status clicável)
15. Criar `TaskFilters`
16. Criar `TaskBoard` com grid responsivo
17. Conectar ao hook e testar com dados reais

### Fase 4 — Dashboard
18. Criar `usePerson` hook
19. Criar `RadarCard` com Recharts RadarChart
20. Criar `TaskProgressCard` com PieChart (donut)
21. Criar `QualityCard` com PieChart (donut)
22. Criar `ErrorsCard` com BarChart stacked
23. Compor `DashboardPage` com layout de 4 cards

### Fase 5 — Technologies
24. Criar dados estáticos de tecnologias (descrição + cor + ícone)
25. Criar `TechCard` com expand/collapse
26. Criar `TechGrid`

### Fase 6 — Study
27. Criar `useStudyPlan` hook
28. Criar `TopicNode` com altura proporcional à duração
29. Criar `TopicDetail` com referências e milestones
30. Criar `StudyTimeline` com linha central e posicionamento por semana
31. Criar overview semanal

### Fase 7 — Polimento
32. Animações de transição entre rotas (React Router + CSS)
33. Estados vazios (sem tasks, sem plano, sem avaliações)
34. Responsividade (tablet/mobile básico)
35. Testar dark/light em todas as páginas
36. Revisar contraste e acessibilidade mínima (WCAG AA)

---

## 10. Decisões e trade-offs

| Decisão | Alternativa descartada | Motivo |
|---------|----------------------|--------|
| React + Vite | HTML puro | Complexidade dos charts e estado requer componentes |
| Recharts | Chart.js | API React-nativa, sem manipulação de canvas |
| Express local | Leitura de arquivos no browser | Browser não pode escrever em filesystem |
| gray-matter | Parser manual | Lida corretamente com frontmatter YAML em .md |
| Tailwind + CSS vars | CSS-in-JS | Mais simples para dark mode com variáveis CSS |
| concurrently | Makefile / dois terminais | Um único `npm run dev` para o usuário |

---

## 11. Como rodar

```bash
# Na raiz do projeto
cd site
npm install
npm run dev

# Frontend: http://localhost:5173
# API:      http://localhost:3001
```
