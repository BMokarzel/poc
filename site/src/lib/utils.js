// Study plan priority colors
export const PRIORITY_COLORS = {
  high:   '#D94A41',
  medium: '#FA5A50',
  low:    '#FA8982',
}

// Study plan topic completion icons
export const STUDY_STATUS_ICONS = {
  not_started: '○',
  in_progress: '◑',
  done:        '●',
}

// Study plan milestone type icons
export const MILESTONE_TYPE_ICONS = {
  reading:        '📖',
  exercise:       '✏️',
  implementation: '💻',
  reflection:     '💭',
}

export const TECH_COLORS = {
  'JavaScript':    '#FAB8B4',
  'Node.js':       '#FA8982',
  'NestJS':        '#D94A41',
  'OpenTelemetry': '#802655',
  'Honeycomb':     '#FAB9FF',
  'Splunk':        '#C785CC',
  'MongoDB':       '#B4DCFA',
  'Redis':         '#8CB3D9',
}

export const STATUS_CONFIG = {
  todo:        { label: 'To Do',       color: '#B4DCFA', bg: 'bg-ocean-light/20',  text: 'text-ocean-muted dark:text-ocean-light' },
  in_progress: { label: 'In Progress', color: '#FA8982', bg: 'bg-primary-light/20', text: 'text-primary-dark dark:text-primary-light' },
  done:        { label: 'Done',        color: '#D94A41', bg: 'bg-primary-dark/20',  text: 'text-primary-xdark dark:text-primary-xlight' },
}

export const LEVEL_CONFIG = {
  insufficient: { label: 'Insuficiente', color: '#690037' },
  partial:      { label: 'Parcial',      color: '#802655' },
  sufficient:   { label: 'Suficiente',   color: '#FA8982' },
  very_good:    { label: 'Muito bom',    color: '#FA5A50' },
  exceptional:  { label: 'Excepcional',  color: '#D94A41' },
}

export const DIFFICULTY_CONFIG = {
  easy:      { label: 'Fácil',       classes: 'bg-ocean-light/20 text-ocean-muted dark:text-ocean-light' },
  medium:    { label: 'Médio',       classes: 'bg-secondary-mid/20 text-secondary-dark dark:text-secondary-xlight' },
  hard:      { label: 'Difícil',     classes: 'bg-primary/20 text-primary-dark dark:text-primary-light' },
  'very-hard': { label: 'Muito difícil', classes: 'bg-secondary-xdark/20 text-secondary-xdark dark:text-secondary-xlight' },
}

export const TYPE_CONFIG = {
  BUG:      { label: 'Bug',      classes: 'bg-secondary-xdark/20 text-secondary-xdark dark:text-secondary-xlight' },
  FEATURE:  { label: 'Feature',  classes: 'bg-primary/20 text-primary-dark dark:text-primary-light' },
  REFACTOR: { label: 'Refactor', classes: 'bg-secondary-dark/20 text-secondary-dark dark:text-secondary-mid' },
  CHORE:    { label: 'Chore',    classes: 'bg-ocean-light/20 text-ocean-muted dark:text-ocean-light' },
}

// Shared Recharts tooltip style — used by all dashboard chart cards
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#14142B',
  border: '1px solid #393973',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#F0F0FF',
}

// Keywords for inferring technology from a pattern string (used by ErrorsCard)
export const TECH_KEYWORDS = {
  'Node.js':       ['node', 'express', 'server'],
  'NestJS':        ['nest', 'module', 'controller', 'service', 'decorator'],
  'OpenTelemetry': ['otel', 'telemetry', 'trace', 'span', 'metric'],
  'MongoDB':       ['mongo', 'schema', 'collection', 'document'],
  'Redis':         ['redis', 'cache', 'ttl'],
  'Splunk':        ['splunk', 'log', 'logging'],
  'Honeycomb':     ['honeycomb', 'observab'],
  'JavaScript':    ['js', 'javascript', 'async', 'promise', 'null', 'undefined', 'error'],
}

// Returns all tech tags from a task (merges services + tags, filters to known techs)
export function getTaskTechs(task) {
  return [...(task.services || []), ...(task.tags || [])].filter(t => t in TECH_COLORS)
}

// Returns inline style for a tech badge (active = solid, inactive = tinted)
export function getTechBadgeStyle(tech, active = false) {
  const color = TECH_COLORS[tech]
  if (!color) return {}
  return active
    ? { backgroundColor: color, color: '#000050' }
    : { backgroundColor: `${color}22`, color }
}

export function inferTechFromPattern(patternText) {
  const lower = patternText.toLowerCase()
  for (const [tech, kws] of Object.entries(TECH_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return tech
  }
  return 'JavaScript'
}

export function nextStatus(current) {
  const cycle = ['todo', 'in_progress', 'done']
  return cycle[(cycle.indexOf(current) + 1) % cycle.length]
}

export function markdownSectionToHtml(md = '') {
  if (!md) return ''
  // Very minimal: convert bullets, bold, and line breaks
  return md
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex gap-2 items-start"><span class="mt-1 shrink-0 w-4 h-4 rounded border-2 border-current opacity-50 inline-block"></span><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex gap-2 items-start line-through opacity-60"><span class="mt-1 shrink-0 w-4 h-4 rounded bg-current inline-block"></span><span>$1</span></li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="px-1 py-0.5 rounded bg-slate-100 dark:bg-navy text-xs font-mono">$1</code>')
    .replace(/\n\n+/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}
