# Inversio - Sistema de Registro e Análise de Trades

## 📋 Sobre o Projeto

O **Inversio** é uma aplicação web completa para registro e análise de operações no mercado financeiro. Desenvolvida para traders que precisam acompanhar suas estratégias, registrar operações e analisar performance através de dashboards interativos com dados em tempo real.

### 🎯 Funcionalidades Principais

- **Autenticação de Usuários**: Sistema completo de login/registro com isolamento de dados por usuário
- **Gestão de Estratégias**: Criação, edição e organização de estratégias de trading
- **Registro de Trades**: Formulário avançado para registro detalhado de operações
- **Dashboard Analytics**: Visualizações interativas com gráficos de performance
- **Filtros Avançados**: Sistema robusto de filtros por data, estratégia e resultados
- **Análise Temporal**: Relatórios por períodos (dia, semana, mês) com navegação temporal

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| **Framework** | Next.js | 15.4.6 |
| **Linguagem** | TypeScript | ^5 |
| **Estilização** | TailwindCSS | ^4 |
| **Componentes UI** | shadcn/ui + Radix UI | - |
| **Backend** | Firebase | ^12.1.0 |
| **Banco de Dados** | Firestore | - |
| **Autenticação** | Firebase Auth | - |
| **Gráficos** | Recharts | ^3.1.2 |
| **Validação** | Zod + React Hook Form | ^4.0.17 |

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   │   ├── login/         # Página de login
│   │   └── register/      # Página de registro
│   ├── (protected)/       # Rotas protegidas (requer auth)
│   │   ├── dashboard/     # Dashboard analytics
│   │   ├── trades/        # Gestão de trades
│   │   └── strategies/    # Gestão de estratégias
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── auth/             # Componentes de autenticação
│   ├── layout/           # Navbar, ProtectedRoute
│   ├── strategies/       # Componentes de estratégias
│   ├── trades/           # Componentes de trades
│   └── ui/               # Componentes shadcn/ui
├── contexts/             # React Contexts
├── hooks/                # Custom hooks
├── lib/                  # Configurações e utilitários
│   ├── firebase.ts      # Config Firebase
│   ├── analytics.ts     # Funções de analytics
│   └── trades.ts        # Operações de trades
├── types/                # Interfaces TypeScript
└── utils/                # Funções auxiliares
```

## 🚀 Configuração do Ambiente

### 1. Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn, pnpm ou bun
- Conta no Firebase

### 2. Instalação

```bash
# Clone o repositório
git clone git@github.com:LeoFuna/inversio.git
cd inversio

# Instale as dependências
npm install
```

### 3. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication (Email/Senha)
3. Crie um banco Firestore
4. Copie as credenciais do projeto

### 4. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build           # Build para produção
npm run start           # Inicia servidor de produção

# Qualidade de código
npm run lint            # Executa ESLint
```

## 📊 Estrutura de Dados

### Estratégias (strategies)
```typescript
interface Strategy {
  id: string;              // ID do documento Firestore
  userId: string;          // UID do usuário autenticado
  name: string;            // Nome da estratégia
  direction: 'Contra Tendencia' | 'Tendencia' | 'Neutro';
  description: string;     // Descrição detalhada
  createdAt: Timestamp;    // Data de criação
  updatedAt: Timestamp;    // Última atualização
}
```

### Trades (trades)
```typescript
interface Trade {
  id: string;              // ID do documento Firestore
  userId: string;          // UID do usuário autenticado
  strategyId?: string;     // Referência à estratégia (opcional)
  stockType: string;       // 'AÇÕES', 'OPÇÕES', 'FUTUROS'
  inTime: string;          // Horário entrada: "HH:MM:SS"
  outTime: string;         // Horário saída: "HH:MM:SS"
  quantity: number;        // Quantidade negociada
  men: number;             // Preço médio de entrada
  mep: number;             // Preço médio de saída
  date: Timestamp;         // Data da operação (timezone aware)
  result: number;          // Resultado líquido da operação
  createdAt: Timestamp;    // Data de criação
  updatedAt: Timestamp;    // Última atualização
}
```

## 📱 Funcionalidades Implementadas

### Dashboard Analytics
- **Seleção de Períodos**: Navegação por dia, semana, mês
- **Filtros por Estratégia**: Análise específica ou geral
- **4 Tipos de Gráficos**: Evolução financeira, ganhos mensais, performance por dia da semana, proporção win/loss
- **Métricas de Performance**: Taxa de acerto, risco/recompensa, médias de ganho/perda
- **Tabela de Performance**: Comparação sortável entre estratégias

### Gestão de Trades
- **Formulário Avançado**: Validação completa com reset automático
- **Tabela Interativa**: Paginação server-side, filtros avançados
- **Filtros Disponíveis**: Período, estratégia, lucro/prejuízo, trades pendentes
- **Atribuição de Estratégias**: Associação posterior de trades a estratégias

### Sistema de Estratégias
- **CRUD Completo**: Criação, leitura, atualização e exclusão
- **Associação com Trades**: Vinculação automática e manual
- **Análise de Performance**: Métricas específicas por estratégia

### TODOS
- [ ] Dificuldade de colocar resultados negativos
- [ ] Validação do formulário de criação de trades