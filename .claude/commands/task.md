Implemente a task $ARGUMENTS seguindo o processo abaixo com rigor.

O argumento pode ser fornecido em dois formatos:
- `backend T-001` ou `backend/T-001` — projeto + ID da task
- `T-001` — assume projeto `backend` por padrão

Extraia o projeto e o ID da task a partir de $ARGUMENTS antes de começar.

---

## 1. Leitura da task

Leia o arquivo `tasks/{projeto}/{ID}.md` na íntegra (ex: `tasks/backend/T-001.md`).
Extraia e registre mentalmente:
- **Contexto**: qual é o estado atual e o problema
- **Escopo**: lista do que DEVE ser feito (cada item é verificável)
- **Dicas**: referências e orientações técnicas
- **Fora do escopo**: o que explicitamente NÃO deve ser feito
- **Definition of done**: critérios binários que determinam conclusão
- **Domain**: partes do código que pertencem a esta task

Os critérios de avaliação estão em `tasks/{projeto}/criteria/{ID}.eval.json`.

---

## 2. Exploração do domínio

Explore o código nos caminhos listados em Domain.
Entenda o que já existe antes de escrever qualquer linha.
Se o Domain mencionar serviços, leia os arquivos relevantes desses serviços.
Identifique padrões usados no entorno — nomenclatura, estrutura de arquivos, estilo de testes.

---

## 3. Perguntas de refinamento

Antes de planejar, verifique se há ambiguidades que impediriam uma implementação correta.
Faça perguntas **somente se** alguma das condições abaixo for verdadeira — não pergunte por perguntar.

**Pergunte sobre o Contexto se:**
- O comportamento atual descrito não for reproduzível com o que está no código
- Houver dependência de ambiente, serviço externo ou dado específico que não está descrito

**Pergunte sobre o Escopo se:**
- Um item for ambíguo a ponto de gerar duas implementações diferentes igualmente válidas
- Um item implicar alterar algo que está listado em "Fora do escopo"
- Não for possível determinar qual camada ou serviço deve ser alterado

**Pergunte sobre o Domain se:**
- O Domain listar caminhos que não existem no repositório
- Houver conflito entre o Domain desta task e código claramente pertencente a outra task

**Pergunte sobre os testes se:**
- O DoD exigir testes mas o estilo esperado (unitário, integração, contrato) não estiver claro
- Não existir nenhum teste no entorno que sirva de referência de estrutura

**Regra:** agrupe todas as perguntas em uma única mensagem. Não intercale perguntas com implementação.
Se não houver nenhuma ambiguidade bloqueante, pule esta etapa e avance para o Planejamento.

---

## 4. Planejamento

Monte mentalmente um plano de implementação mapeando cada item do Escopo
a arquivos e mudanças concretas.
Verifique se o plano cobre todos os itens do Definition of done.
Se algum item do DoD não tiver cobertura no plano, ajuste o plano antes de continuar.

---

## 5. Implementação

Implemente o plano.

Regras durante a implementação:
- Implemente apenas o que está no Escopo — nada além
- Não refatore código fora do Domain desta task
- Não adicione features, abstrações ou melhorias não solicitadas
- Siga o padrão de código existente no entorno (nomenclatura, estrutura, estilo)
- Se as Dicas sugerirem uma abordagem, considere-a antes de escolher outra
- Cada arquivo alterado deve ter uma razão mapeável a um item do Escopo

---

## 6. Verificação do Definition of done

Percorra cada item do DoD e verifique objetivamente:
- [ ] O critério está atendido?
- [ ] Há evidência concreta no código (não intenção)?

Se algum item não estiver atendido, corrija antes de encerrar.

---

## 7. Verificação do Fora do escopo

Revise o que foi alterado e confirme que nada viola os itens de "Fora do escopo".
Se encontrar algo fora dos limites, remova ou reverta.

---

## 8. Relatório final

Ao concluir, apresente:

**Implementado:**
- Lista dos itens do Escopo implementados, com arquivo(s) correspondente(s)

**DoD:**
- Cada critério com ✓ ou ✗ e a evidência (linha ou comportamento)

**Fora do escopo — confirmado não implementado:**
- Lista dos itens confirmados

Se algum item do DoD estiver ✗, explique o bloqueio antes de encerrar.
