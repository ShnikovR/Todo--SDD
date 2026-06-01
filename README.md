# todo-sdd

Aplicação web de gerenciamento de tarefas (To-Do) desenvolvida com **Spec Driven Development (SDD)** e evolução de especificação **v1 → v2 (OpenSpec)**.

Repositório pronto para publicação no GitHub com documentação, código em camadas, testes unitários (Vitest) e E2E (Cypress).

---

## Descrição do projeto

O **todo-sdd** permite:

- Cadastrar, listar, editar e excluir tarefas
- Marcar tarefas como concluídas
- Definir prioridade (Baixa, Média, Alta)
- Filtrar por Todas, Pendentes ou Concluídas
- Persistir dados localmente em `data/tasks.json`

O desenvolvimento foi guiado por especificações formais antes da implementação. Detalhes em [`docs/especificacao-v1.md`](docs/especificacao-v1.md) e [`docs/especificacao-v2.md`](docs/especificacao-v2.md).

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|------------|-----|
| **Node.js** | Runtime |
| **TypeScript** | Tipagem e código-fonte |
| **Express** | API REST e servidor HTTP |
| **Vitest** | Testes unitários e cobertura |
| **Cypress** | Testes end-to-end |
| **Vite** | Bundler/dev server para assets estáticos (opcional) |
| **JSON (arquivo)** | Persistência local (RF08) |

---

## Estrutura do projeto

```text
todo-sdd/
│
├── README.md
│
├── docs/
│   ├── especificacao-v1.md
│   ├── especificacao-v2.md
│   ├── casos-de-uso.md
│   ├── regras-de-negocio.md
│   └── uso-da-ia.md
│
├── src/
│   ├── domain/           # Entidade Task, regras RN01–RN04
│   ├── application/      # TaskService (RF01–RF08)
│   ├── infrastructure/   # JsonFileTaskRepository
│   ├── presentation/     # Express, rotas, public/
│   └── tests/            # Testes unitários Vitest
│
├── cypress/
│   ├── e2e/
│   ├── fixtures/
│   └── support/
│
├── data/                 # tasks.json (gerado em runtime)
├── package.json
├── vite.config.js
├── vitest.config.js
└── cypress.config.js
```

| Pasta | Responsabilidade |
|-------|------------------|
| `docs/` | Especificações, casos de uso, regras e relatório de IA |
| `src/domain/` | Modelo e validações de negócio |
| `src/application/` | Casos de uso e orquestração |
| `src/infrastructure/` | Persistência em arquivo JSON |
| `src/presentation/` | API HTTP e interface (`public/`) |
| `src/tests/` | Testes unitários |
| `cypress/` | Testes E2E |

---

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar a aplicação

```bash
npm run dev
```

Acesse: **http://127.0.0.1:3000**

### 3. Executar testes unitários

```bash
npm run test
```

Com relatório de cobertura (meta ≥ 80%):

```bash
npm run test:coverage
```

### 4. Executar testes E2E

```bash
npm run test:e2e
```

> Sobe o servidor em modo teste, executa Cypress e encerra. Se a porta 3000 estiver em uso, finalize o processo anterior.

### Frontend com Vite (opcional)

Com a API em `npm run dev` (porta 3000):

```bash
npm run dev:vite
```

Abre **http://127.0.0.1:5173** com proxy para `/api`.

---

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor Express + UI (porta 3000)
npm run test         # Testes unitários (Vitest)
npm run test:coverage # Cobertura de código
npm run test:e2e     # Testes E2E (Cypress)
npm run build        # Compilar TypeScript → dist/
npm start            # Executar build de produção
```

---

## Testes

### Unitários (Vitest)

Cobertura de:

- Cadastro válido e inválido
- Edição e exclusão
- Conclusão de tarefa
- Prioridade e filtros
- Persistência em JSON

Arquivos: `src/tests/*.test.ts`

### E2E (Cypress)

Cenários em `cypress/e2e/todo.cy.ts`:

1. Criar tarefa  
2. Editar tarefa  
3. Excluir tarefa  
4. Concluir tarefa  
5. Filtrar concluídas  
6. Validação sem título  

---

## Aplicação dos conceitos de SDD

### Como a especificação guiou o desenvolvimento

1. **v1** definiu RF01–RF03 e RN01–RN06 → implementação inicial em camadas.
2. Nenhum requisito foi codificado sem referência na spec.
3. Testes da v1 mapeados aos critérios CT01–CT04.

### Como a evolução da spec impactou a implementação

| Mudança na spec | Impacto no código |
|-----------------|-------------------|
| RF04–RF05 | `editarTarefa`, `excluirTarefa`, UI modal e botão excluir |
| RF06 | Enum `PrioridadeTarefa`, selects na UI |
| RF07 | `listarTarefas(filtro)`, botões de filtro |
| RF08 | `JsonFileTaskRepository`, `data/tasks.json` |
| Modelo expandido | `dataCriacao`, `dataAtualizacao` na entidade |

A spec v2 (OpenSpec) introduziu **critérios de aceite** e **cenários de erro**, que viraram testes Vitest e Cypress.

### Como a IA foi utilizada

Documentado em [`docs/uso-da-ia.md`](docs/uso-da-ia.md):

- Ferramenta: Cursor Agent
- Prompts por etapa (v1, v2, estrutura GitHub)
- IA como acelerador; spec permanece fonte da verdade

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [especificacao-v1.md](docs/especificacao-v1.md) | RF/RN/UC iniciais |
| [especificacao-v2.md](docs/especificacao-v2.md) | Evolução, CA, cenários |
| [casos-de-uso.md](docs/casos-de-uso.md) | UC consolidados |
| [regras-de-negocio.md](docs/regras-de-negocio.md) | RN v1 + v2 |
| [uso-da-ia.md](docs/uso-da-ia.md) | Relatório de IA e SDD |

---

## Análise da Evolução da Especificação e Uso da IA

Durante o desenvolvimento deste projeto foi possível observar a importância da evolução da especificação no processo de desenvolvimento de software.

Na primeira versão, a especificação continha apenas requisitos básicos, permitindo a criação de uma aplicação simples com funcionalidades de cadastro, listagem e conclusão de tarefas. Embora suficiente para uma implementação inicial, a documentação apresentava poucas regras de negócio e poucos detalhes sobre o comportamento esperado do sistema.

Na segunda versão, a especificação foi refinada com novos requisitos funcionais, incluindo edição, exclusão, definição de prioridade, filtros e persistência de dados. Além disso, foram adicionados critérios de aceite, cenários de uso e regras de negócio mais detalhadas. Essa evolução tornou os requisitos mais claros, reduziu ambiguidades e facilitou a implementação das novas funcionalidades.

A utilização da Inteligência Artificial auxiliou principalmente no refinamento da especificação, na geração de código e na criação de testes. A partir dos requisitos definidos, a IA contribuiu para estruturar a arquitetura do projeto, sugerir boas práticas de desenvolvimento e gerar exemplos de testes unitários e testes E2E.

Os resultados demonstraram que especificações mais completas produzem implementações mais consistentes e facilitam o uso de ferramentas de IA, uma vez que respostas mais precisas dependem diretamente da qualidade das instruções fornecidas. Dessa forma, foi possível perceber na prática os benefícios da abordagem Spec Driven Development (SDD), onde a especificação se torna o principal guia para o desenvolvimento, validação e evolução do sistema.

---

## Licença

Projeto acadêmico — uso educacional.
