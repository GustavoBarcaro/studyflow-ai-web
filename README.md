# StudyFlow AI Web

Frontend web do StudyFlow AI.

Aplicação React + TypeScript com Vite para estudo assistido por IA, organizada em:

- autenticação
- topics
- sessions
- chat com IA
- study tools
- learning paths
- quizzes de session
- quizzes efêmeros de learning path

## Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Radix UI primitives
- `shadcn/ui` via CLI oficial, com componentes gerados no projeto

## Requisitos

- Node.js 20+ recomendado
- npm
- API do `studyflow-ai-api` rodando e acessível

Observação:

- O projeto costuma buildar também em Node 18, mas a combinação atual de libs está mais alinhada com Node 20+.

## Instalação

Clone o projeto e instale as dependências:

```bash
npm install
```

## Variáveis de ambiente

Crie o arquivo `.env` com base no exemplo:

```bash
cp .env.example .env
```

Variáveis disponíveis:

```env
VITE_API_BASE_URL=http://localhost:3333
```

### Como funciona

`VITE_API_BASE_URL`

- URL base da API
- em ambiente local normalmente aponta para `http://localhost:3333`
- em produção deve apontar para a URL pública da API

Importante:

- Em Vite, apenas variáveis com prefixo `VITE_` ficam disponíveis no frontend
- Se alterar `.env`, reinicie o servidor do Vite

## Como rodar localmente

### 1. Suba a API

O frontend depende do backend `studyflow-ai-api`.

Se você tiver os dois repositórios lado a lado, suba a API primeiro no projeto correspondente.

Exemplo esperado:

- frontend: `studyflow-ai-web`
- backend: `studyflow-ai-api`

### 2. Configure a URL da API

No `.env`:

```env
VITE_API_BASE_URL=http://localhost:3333
```

### 3. Rode o frontend

```bash
npm run dev
```

Por padrão o Vite sobe em:

```txt
http://localhost:5173
```

## Scripts

### `npm run dev`

Inicia o servidor de desenvolvimento do Vite.

### `npm run build`

Executa:

- checagem TypeScript
- build de produção com Vite

### `npm run preview`

Sobe o preview do build gerado em `dist/`.

## Fluxo de autenticação

O frontend usa:

- `accessToken` para autenticação nas requests
- `refresh token` via cookie HTTP-only

### Comportamento atual

- login/signup retornam um `accessToken`
- o frontend persiste esse token localmente
- o `refresh token` fica em cookie
- antes de requests autenticadas, o cliente verifica se o JWT expirou ou está perto de expirar
- se necessário, chama `POST /refresh`
- se uma request ainda assim voltar `401`, o cliente tenta refresh e faz retry uma vez

Arquivos principais:

- [src/shared/lib/api.ts](src/shared/lib/api.ts)
- [src/shared/lib/auth.ts](src/shared/lib/auth.ts)
- [src/features/auth/store.ts](src/features/auth/store.ts)

## Rotas principais

### Públicas

- `/login`
- `/signup`

### Protegidas

- `/topics`
- `/topics/:topicId`
- `/sessions/:sessionId`
- `/quizzes/:sessionId`
- `/learning-path-steps/:stepId/quiz`

Arquivo de roteamento:

- [src/app/router.tsx](src/app/router.tsx)

## Estrutura do projeto

```txt
src/
  app/
  components/
    ui/
  features/
    auth/
    learning-paths/
    messages/
    quizzes/
    sessions/
    study-tools/
    topics/
  pages/
    learning-path-quiz/
    login/
    quiz/
    session/
    signup/
    topic-details/
    topics/
  lib/
  shared/
    components/
      common/
      layout/
    hooks/
    lib/
    types/
```

### Convenções

`pages/`

- composição de telas e integração de hooks/queries

`features/`

- componentes e fluxos por domínio funcional

`components/ui/`

- componentes gerados pelo CLI oficial do `shadcn/ui`
- base canônica usada pelo projeto para `button`, `card`, `input`, `dialog`, `badge` e afins

`lib/`

- utilitários canônicos esperados pelo `shadcn/ui`
- hoje inclui `cn` em `src/lib/utils.ts`

`shared/lib/`

- API client
- auth helpers
- formatters
- utilidades específicas de domínio da aplicação

## Funcionalidades atuais

### Auth

- signup
- login
- refresh de sessão
- logout

### Topics

- listar topics
- criar topic
- deletar topic
- escolher cor em hexadecimal

### Sessions

- listar sessions por topic
- criar session
- deletar session
- abrir session existente a partir do learning path quando o título já coincide

### Chat

- enviar mensagem
- render otimista da mensagem do usuário
- bubble de loading da IA
- scroll automático para a última mensagem
- respostas em markdown

### Study tools

- summarize
- explain again
- generate quiz por session

### Learning path

- gerar learning path manualmente por topic
- usar goal opcional
- usar session opcional como contexto
- criar/abrir session a partir de um step
- testar step com quiz efêmero

### Learning path quiz

- rota dedicada por step
- sempre `hard`
- sempre `10 questions`
- se nota `>= 70%`, o step é concluído

## Integração com a API

O frontend espera que a API exponha, entre outras, rotas como:

- `POST /signup`
- `POST /login`
- `POST /refresh`
- `POST /logout`
- `GET /topics`
- `POST /topics`
- `DELETE /topics/:id`
- `GET /sessions`
- `POST /sessions`
- `DELETE /sessions/:id`
- `GET /sessions/:id`
- `GET /sessions/:id/messages`
- `POST /sessions/:id/messages`
- `POST /sessions/:id/summarize`
- `POST /sessions/:id/explain-again`
- `POST /sessions/:id/quiz`
- `GET /topics/:id/learning-path`
- `POST /topics/:id/learning-path`
- `PATCH /learning-path-steps/:id/complete`
- `PATCH /learning-path-steps/:id/incomplete`
- `POST /learning-path-steps/:id/quiz`

Cliente HTTP principal:

- [src/shared/lib/api.ts](src/shared/lib/api.ts)

## shadcn/ui

O projeto usa `shadcn/ui` do jeito esperado pelo ecossistema:

- configuração via [components.json](components.json)
- componentes gerados pelo CLI em [src/components/ui](src/components/ui)
- utilitário canônico em [src/lib/utils.ts](src/lib/utils.ts)

Observação importante:

- `shadcn/ui` não é uma biblioteca runtime como MUI ou Ant Design
- o fluxo oficial é gerar os componentes no repositório com o CLI
- por isso os componentes de UI vivem no código do projeto e podem receber ajustes locais quando necessário

## Deploy

O projeto inclui [vercel.json](vercel.json) com rewrite para SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso evita `404` ao acessar diretamente rotas como:

- `/login`
- `/topics/abc`
- `/sessions/xyz`

### Deploy na Vercel

Defina a variável:

```env
VITE_API_BASE_URL=https://sua-api-em-producao.com
```

Importante:

- a variável deve existir no ambiente correto da Vercel
- mudanças nessa variável exigem novo deploy

## Troubleshooting

### 1. O frontend não fala com a API

Verifique:

- se a API está rodando
- se `VITE_API_BASE_URL` está correta
- se a API aceita requests do domínio do frontend
- se cookies estão configurados corretamente para refresh

### 2. Fui desconectado depois de um tempo

O frontend hoje faz refresh proativo do `accessToken` usando o cookie de refresh.

Se ainda houver logout inesperado, verifique no backend:

- validade do refresh token
- política de rotação/invalidação
- CORS com `credentials`
- configuração de `SameSite` e `Secure` do cookie

### 3. Alterei `.env` e nada mudou

Reinicie o Vite:

```bash
npm run dev
```

### 4. A rota funciona navegando, mas dá 404 ao atualizar

Verifique se o deploy está usando [vercel.json](vercel.json) com rewrite para `index.html`.

### 5. O build mostra warning de chunk grande

Atualmente isso não bloqueia o build.

Se quiser otimizar depois:

- lazy load nas páginas
- code splitting por rota

## Qualidade e manutenção

Recomendações para continuar evoluindo:

- manter componentes de navegação e UI em `shared/components`
- centralizar integrações HTTP em `shared/lib/api.ts`
- evitar lógica de domínio espalhada em múltiplas páginas
- preferir componentes por feature em vez de componentes genéricos sem dono

## Comandos rápidos

Instalar dependências:

```bash
npm install
```

Rodar em dev:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Rodar preview:

```bash
npm run preview
```
