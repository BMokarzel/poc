Você vai criar o projeto base de onboarding técnico — o repositório que o dev receberá e sobre o qual as tasks serão construídas.

**Estrutura multi-projeto:** este repositório suporta múltiplos projetos (backend, ios, android, react, react-native).
Ao criar um novo projeto:
- O código-fonte vai em `{projeto}/` na raiz (ex: `ios/`, `react/`)
- As tasks vão em `tasks/{projeto}/T-NNN.md` (ex: `tasks/ios/T-001.md`)
- Os critérios de avaliação vão em `tasks/{projeto}/criteria/T-NNN.eval.json`
- O `tasks/{projeto}/status.json` controla o status das tasks do projeto
- O diretório raiz do projeto já deve existir; se não existir, crie-o antes de popular

Antes de gerar qualquer arquivo, faça as perguntas abaixo em uma única mensagem.
Agrupe-as por bloco. Não comece a implementar até ter todas as respostas.

---

## Perguntas obrigatórias

### Bloco 1 — Contexto do projeto

1. Qual é o nome do projeto e o domínio de negócio? (ex: "plataforma de pagamentos", "sistema de logística")
2. Qual é o stack obrigatório? Confirme quais das tecnologias abaixo devem estar presentes:
   - JavaScript ou TypeScript?
   - Node.js + NestJS, ou Node.js puro?
   - MongoDB (Mongoose ou driver nativo?)
   - Redis (cache, pub/sub, ou filas?)
   - OpenTelemetry (traces, métricas, logs — quais?)
   - Honeycomb como backend de traces?
   - Splunk para logs?
3. O projeto é um monolito ou microsserviços? Se microsserviços: quantos e quais são os nomes dos serviços?

### Bloco 2 — Estrutura e padrões

4. Qual padrão arquitetural dentro de cada serviço? (ex: modules/controllers/services do NestJS, ou algo customizado?)
5. Qual framework de testes? (Jest, Vitest, outro?) Há distinção entre testes unitários e de integração?
6. Existe um comando de functional check que o avaliador vai rodar? (ex: `make test:contract service=X`, `npm run test:e2e`)
7. Existe algum pattern file já definido que o código deve seguir? (ex: padrão de instrumentação OTel, estrutura de log)

### Bloco 3 — Nível e intenção das tasks

8. Qual o nível dos desenvolvedores que farão o onboarding? (junior / mid / senior)
9. Quantas tasks estão planejadas e qual a distribuição de dificuldade? (ex: 3 easy, 4 medium, 2 hard)
10. Quais tipos de tasks predominam? (FEATURE, BUG, REFACTOR, CHORE)
11. O projeto deve ter falhas ou lacunas intencionais para tasks de BUG/REFACTOR? Se sim, descreva os gaps previstos.

### Bloco 4 — Estado inicial entregue ao dev

12. O dev recebe o projeto com os serviços rodando (docker-compose pronto) ou monta o ambiente do zero?
13. Há dados de seed/fixture necessários para as tasks funcionarem?
14. O projeto deve ter README com instruções de setup? Se sim, qual o nível de detalhe esperado?

---

## Após receber as respostas

Com as respostas em mãos, execute este processo:

### 1. Planejamento da estrutura

Monte a árvore de diretórios completa antes de criar qualquer arquivo.
Apresente a estrutura ao usuário e aguarde confirmação antes de continuar.

### 2. Scaffolding base

Crie os arquivos na seguinte ordem:
1. Crie o diretório `{projeto}/` na raiz se ainda não existir (ex: `ios/`, `react/`)
2. Crie `tasks/{projeto}/` com `status.json` (`{}`) e `tasks/{projeto}/criteria/template.json` (cópia de `tasks/criteria/template.json`)
3. `package.json` (ou `package.json` por serviço) com dependências exatas
2. Arquivos de configuração: `tsconfig.json`, `.eslintrc`, `.prettierrc`, `jest.config.js`
3. Estrutura de módulos vazia mas compilável (sem lógica de negócio ainda)
4. Configuração de ambiente: `.env.example` com todas as variáveis necessárias
5. `docker-compose.yml` se o dev precisa de infraestrutura local
6. README com setup mínimo

### 3. Código base intencional

Para cada serviço/módulo:
- Implemente o esqueleto com interfaces e contratos definidos
- Deixe os pontos de extensão claros (onde as tasks vão atuar)
- Se houver tasks de BUG: introduza as falhas planejadas com comentário `// INTENTIONAL: [descrição]` visível apenas para o criador do projeto (remover antes de entregar ao dev)
- Se houver tasks de FEATURE: deixe o stub com `throw new NotImplementedException()` ou equivalente
- Se houver tasks de REFACTOR: implemente a versão "antes" que será refatorada

### 4. Instrumentação base

Se OpenTelemetry estiver no stack:
- Configure o provider e exporters no bootstrap do serviço
- Instrumente pelo menos uma rota/handler como referência
- Deixe os demais sem instrumentação (material para tasks)

Se Splunk/logs estiverem no stack:
- Configure o logger com o formato estruturado esperado
- Instrumente o bootstrap e o handler de erros global

### 5. Testes

Crie pelo menos um teste por serviço que sirva de referência de estrutura.
O teste deve cobrir o caminho happy path mais simples.
Não crie testes para os pontos que serão alvo das tasks — esses ficam em aberto.

### 6. Verificação final

Antes de encerrar, confirme:
- [ ] O projeto compila sem erros
- [ ] Os testes existentes passam
- [ ] Cada serviço tem ao menos um endpoint/handler funcional de ponta a ponta
- [ ] Os pontos de extensão para as tasks estão claramente demarcados
- [ ] Não há dependências de segredo real (apenas variáveis de `.env.example`)

### 7. Resumo de entrega

Apresente ao final:
- Estrutura criada (árvore)
- Por serviço: o que está implementado vs o que está em aberto para as tasks
- Comando para subir o ambiente
- Pontos de atenção para quem vai criar as tasks em cima deste projeto
