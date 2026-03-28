# Backend — Plataforma de Compra Online

Dois microsserviços NestJS:

- **BFF** (porta 3000): recebe requisições do frontend, orquestra chamadas ao Core
- **Core** (porta 3001): lógica de negócio, persistência em MongoDB

## Pré-requisitos

- Docker e Docker Compose instalados

## Como rodar

```bash
cp .env.example .env
docker compose up --build
```

BFF: http://localhost:3000
Core: http://localhost:3001

## Endpoints disponíveis

### BFF
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /products | Lista produtos (paginado via query `?page=1&limit=10`) |
| GET | /products/:id | Detalhe de produto |
| GET | /orders | Lista pedidos |
| POST | /orders | Cria pedido |
| GET | /pages | Lista páginas disponíveis |
| GET | /pages/:slug | Conteúdo de página (home, product-listing, checkout) |

### Core
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /products | Lista produtos |
| GET | /products/:id | Detalhe de produto |
| POST | /products | Cria produto |
| GET | /orders | Lista pedidos |
| POST | /orders | Cria pedido |
| GET | /customers | Lista clientes |
| GET | /customers/:id | Detalhe de cliente |
| POST | /customers | Cria cliente |

## Rodar testes

```bash
# BFF
cd bff && npm test

# Core
cd core && npm test
```
