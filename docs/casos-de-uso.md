# Casos de Uso — To-Do SDD

Documento consolidado dos casos de uso das versões 1 e 2 da especificação.

---

## Versão 1

### UC01 — Cadastrar tarefa

| Campo | Descrição |
|-------|-----------|
| **Ator** | Usuário |
| **Pré-condição** | Aplicação em execução |
| **Pós-condição** | Nova tarefa na lista com status Pendente |

**Fluxo principal**

1. Usuário informa o título.
2. Sistema valida título (RN01, RN04).
3. Sistema gera `id`, define status Pendente (RN02).
4. Sistema persiste e exibe lista atualizada.

**Fluxo alternativo — título inválido**

1. Título vazio ou apenas espaços.
2. Sistema rejeita e exibe erro.
3. Lista permanece inalterada.

---

### UC02 — Listar tarefas

| Campo | Descrição |
|-------|-----------|
| **Ator** | Usuário |
| **Pré-condição** | Aplicação em execução |

**Fluxo principal**

1. Usuário acessa a tela principal.
2. Sistema recupera todas as tarefas.
3. Sistema exibe título e status.

**Fluxo alternativo — lista vazia**

1. Nenhuma tarefa cadastrada.
2. Sistema exibe mensagem informativa.

---

### UC03 — Concluir tarefa

| Campo | Descrição |
|-------|-----------|
| **Ator** | Usuário |
| **Pré-condição** | Existe tarefa Pendente |

**Fluxo principal**

1. Usuário aciona "Concluir".
2. Sistema localiza tarefa por `id`.
3. Sistema altera status para Concluída (RN03).
4. Interface atualizada.

**Fluxo alternativo — tarefa inexistente**

1. `id` inválido.
2. Sistema retorna erro (RN06 v1).

---

## Versão 2 (novos e estendidos)

### UC04 — Editar tarefa

| Campo | Descrição |
|-------|-----------|
| **Ator** | Usuário |
| **Pré-condição** | Tarefa existente |
| **Pós-condição** | Dados atualizados e persistidos (RN07) |

**Fluxo principal**

1. Usuário clica em "Editar".
2. Sistema exibe formulário com dados atuais.
3. Usuário altera título e/ou prioridade.
4. Sistema valida e atualiza `dataAtualizacao`.
5. Sistema persiste e atualiza lista.

**Fluxo alternativo — id inexistente**

1. Sistema retorna erro (RN05).

---

### UC05 — Excluir tarefa

**Fluxo principal**

1. Usuário confirma exclusão.
2. Sistema remove do repositório.
3. Sistema persiste (RN07).
4. Lista atualizada.

**Fluxo alternativo — id inexistente:** erro RN06.

---

### UC06 — Filtrar tarefas

**Fluxo principal**

1. Usuário seleciona filtro (Todas / Pendentes / Concluídas).
2. Sistema aplica filtro em memória (RN08).
3. Interface exibe subconjunto imediatamente.

**Fluxo alternativo — sem resultados:** mensagem de lista vazia.

---

### UC07 — Definir prioridade

**Fluxo principal**

1. Na criação ou edição, usuário escolhe Baixa, Média ou Alta.
2. Sistema valida enum.
3. Sistema persiste prioridade (RN04 no cadastro se omitida).

---

### UC08 — Concluir tarefa (v2)

Equivalente ao UC03, com persistência automática em disco após conclusão (RN07).

---

## Diagrama de relação (v2)

```
Usuário
   │
   ├── UC01 Criar ──────────► TaskService.criarTarefa
   ├── UC02 Listar ─────────► TaskService.listarTarefas
   ├── UC03/UC08 Concluir ──► TaskService.concluirTarefa
   ├── UC04 Editar ─────────► TaskService.editarTarefa
   ├── UC05 Excluir ────────► TaskService.excluirTarefa
   ├── UC06 Filtrar ────────► TaskService.listarTarefas(filtro)
   └── UC07 Prioridade ─────► Task.criar / Task.atualizar
```
