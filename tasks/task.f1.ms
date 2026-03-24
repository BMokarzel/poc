###Task F1

Tipo: FEATURE

Título: [verbo no infinitivo + objeto]

Contexto:
Nada ainda foi implementado neste projeto.
O primeiro passo para a construção deste novo serviço em golang é a implementação da abertura do servidor. 
Implemente a abertura do servidor http na porta 8080.

Escopo:
O servidor deve rodar sem erros, escutando a porta 8080.
Chamada ao endpoint /health deve responder status code 200 com ok.

Fora do escopo:
Criação de novos diretórios ou funcionalidades.

Dicas (opcional):
Investigue o pacote net/http padrão do golang para saber mais sobre como funciona.
Existem frameworks e bibliotecas mais completas, como chi e gin.

Definition of done:
- responder 200 e ok na porta 8080 /health

###Correção Task F1

{
  "taskId": "f-1",
  "title": "Corrigir GET /products/:id",
  "levels": [
    {
      "level": "acceptable",
      "description": "Implementou o servidor com sucesso",
      "criteria": [
        "Servidor rodando na porta 8080 sem erro",
        "Chamada ao /health respondendo 200 com ok",
      ]
    },
    {
      "level": "good",
      "description": "Desenvolveu com qualidade de produção",
      "criteria": [
        "Fez logs da requisição",
      ]
    },
    {
      "level": "excellent",
      "description": "Fez uso de ferramentas mais avançadas no desenvolvimento",
      "criteria": [
        "Utilizou chi ou outra biblioteca mais completa para implementar o servidor"
      ]
    }
  ],
  "antipatterns": [
    "Retornar null ou undefined em vez de lançar exceção",
    "Try/catch vazio que engole o erro",
    "Validação feita no controller em vez de num pipe separado"
  ],
  "context_for_evaluator": "O dev não foi instruído a usar zod. Se ele usou, é sinal de iniciativa. Se validou de qualquer outra forma consistente, também é válido para o nível good."
}