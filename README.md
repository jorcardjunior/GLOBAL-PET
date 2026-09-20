# Global Pet & AgroRação Pro

Aplicação web de divulgação e atendimento para a Global Pet & AgroRação Pro — pet shop e agro insumos. Inclui catálogo de produtos/serviços, chat consultivo com IA (Gemini) e servidor Express com proteção de segurança básica.

> Status: projeto em desenvolvimento ativo (`NÃO CONFIRMADO` para deploy, banco e testes — não verificados no repositório).

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 4, Recharts, Motion |
| Backend | Node.js + Express 4.21 (`server.ts`) |
| IA | Google Gemini via `@google/genai` |
| Segurança | helmet (headers HTTP), express-rate-limit (rate limiting global e de autenticação) |
| Build | Vite (frontend) + esbuild (bundle do servidor, `dist/server.cjs`) |

> **Nota:** a documentação do projeto menciona React 18, mas o `package.json` declara `react@^19.0.1` — o `package.json` é a fonte da versão real (`PARCIAL`).

## Como rodar localmente

```bash
npm install
npm run dev       # tsx server.ts — sobe o app em http://localhost:3000
```

Build e produção:

```bash
npm run build     # vite build && esbuild (gera dist/)
npm start         # node dist/server.cjs
npm run lint      # tsc --noEmit
```

## Variáveis de ambiente

Veja `.env.example`:

- `GEMINI_API_KEY` — chave da API do Google Gemini (usada pelo chat com IA).
- `APP_URL` — URL pública onde o app é hospedado.

## Segurança do servidor

- `helmet` com `contentSecurityPolicy`, `crossOriginEmbedderPolicy` e `frameguard` desabilitados (compatibilidade com container de visualização).
- Payload JSON limitado a 10 MB.
- Rate limit global (300 req/min/IP) e rate limit específico de autenticação (30 req/15min/IP), com mensagem de bloqueio em português.

## Estrutura

```
server.ts      # servidor Express (rotas, segurança, IA Gemini)
vite.config.ts # configuração do frontend
```

> Há um arquivo `documentacao.md` na raiz com o manual da aplicação (havia uma variação de nome com acento, removida como duplicata).

## Notas

- Banco de dados: não localizado no repositório (`NÃO CONFIRMADO`).
- Testes automatizados: não localizados (`NÃO CONFIRMADO`).
- Deploy em produção: não verificado (`NÃO CONFIRMADO`). As variáveis de ambiente sugerem hospedagem em ambiente compatível com Google AI Studio / Cloud Run (injeção automática de secrets).