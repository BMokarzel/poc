import TechCard from './TechCard'

const TECHNOLOGIES = [
  {
    name: 'JavaScript',
    tagline: 'Linguagem da web',
    icon: '⚡',
    description: 'Linguagem de programação interpretada utilizada tanto no frontend quanto no backend. Base de toda a stack da squad, permite escrever lógica de negócio assíncrona com Promises e async/await.',
    docsUrl: 'https://developer.mozilla.org/pt-BR/docs/Web/JavaScript',
  },
  {
    name: 'Node.js',
    tagline: 'Runtime JavaScript server-side',
    icon: '🟢',
    description: 'Runtime que executa JavaScript fora do browser usando o motor V8 do Chrome. É a base dos nossos microsserviços, com event loop não-bloqueante e alto throughput para I/O.',
    docsUrl: 'https://nodejs.org/pt/docs',
  },
  {
    name: 'NestJS',
    tagline: 'Framework Node.js empresarial',
    icon: '🐱',
    description: 'Framework progressivo para Node.js que utiliza TypeScript de forma nativa, com módulos, controllers, services e injeção de dependências inspirada no Angular. Usado para estruturar nossos microsserviços.',
    docsUrl: 'https://docs.nestjs.com/',
  },
  {
    name: 'OpenTelemetry',
    tagline: 'Observabilidade padronizada',
    icon: '🔭',
    description: 'Framework vendor-neutral para coletar telemetria (traces, métricas, logs). Instrumentamos nossos serviços com o SDK do OTel para enviar dados para o Honeycomb e garantir rastreabilidade ponta a ponta.',
    docsUrl: 'https://opentelemetry.io/docs/',
  },
  {
    name: 'Honeycomb',
    tagline: 'Observabilidade e análise de traces',
    icon: '🍯',
    description: 'Plataforma de observabilidade que recebe os traces do OpenTelemetry. Permite fazer queries arbitrárias nos dados de telemetria e identificar gargalos e anomalias em produção.',
    docsUrl: 'https://docs.honeycomb.io/',
  },
  {
    name: 'Splunk',
    tagline: 'Plataforma de logs e SIEM',
    icon: '📊',
    description: 'Ferramenta de agregação e análise de logs utilizada para monitorar eventos de segurança e operacionais. Nossos serviços emitem logs estruturados que são indexados pelo Splunk.',
    docsUrl: 'https://docs.splunk.com/',
  },
  {
    name: 'MongoDB',
    tagline: 'Banco de dados orientado a documentos',
    icon: '🍃',
    description: 'Banco NoSQL que armazena dados em documentos BSON flexíveis. Usado nos serviços onde o schema evolui com frequência. Acessado via Mongoose no Node.js para validação e modelagem.',
    docsUrl: 'https://www.mongodb.com/docs/',
  },
  {
    name: 'Redis',
    tagline: 'Cache e mensageria in-memory',
    icon: '🔴',
    description: 'Banco de dados in-memory de alta performance. Usado principalmente para cache de respostas, sessões e como broker de filas com Pub/Sub e Streams nos nossos pipelines de dados.',
    docsUrl: 'https://redis.io/docs/',
  },
]

export default function TechGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="section-title mb-2">Technologies</h1>
      <p className="text-sm text-slate-400 mb-8">
        Clique em um card para saber mais sobre a tecnologia
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {TECHNOLOGIES.map(tech => (
          <TechCard key={tech.name} tech={tech} />
        ))}
      </div>
    </div>
  )
}
