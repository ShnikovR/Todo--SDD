# Especificação v1 — Aplicação To-Do

**Versão:** 1.0  
**Metodologia:** Spec Driven Development (SDD)

---

## Objetivo do sistema

Desenvolver uma aplicação web de gerenciamento de tarefas que permita **cadastrar**, **listar** e **marcar como concluídas** atividades do usuário, com foco em simplicidade e aderência à especificação antes da codificação.

### Público-alvo

- Usuários individuais que organizam tarefas do dia a dia;
- Contexto acadêmico (TDE) e prototipagem rápida.

---

## Requisitos funcionais iniciais

| ID | Descrição |
|----|-----------|
| **RF01** | O usuário deve poder cadastrar uma nova tarefa informando um título. |
| **RF02** | O usuário deve poder visualizar todas as tarefas cadastradas (título e status). |
| **RF03** | O usuário deve poder marcar uma tarefa existente como concluída. |

---

## Requisitos não funcionais

| ID | Descrição |
|----|-----------|
| **RNF01** | Interface simples e intuitiva em navegador moderno. |
| **RNF02** | Persistência em memória durante a execução (dados perdidos ao reiniciar). |
| **RNF03** | Código organizado em camadas (domínio, aplicação, infraestrutura, apresentação). |
| **RNF04** | Código documentado nos pontos críticos. |
| **RNF05** | Testes automatizados para fluxos principais. |

---

## Regras de negócio da versão 1

| ID | Regra |
|----|-------|
| **RN01** | Toda tarefa deve possuir título não vazio (após trim). |
| **RN02** | Tarefa nova inicia com status **Pendente**. |
| **RN03** | Tarefa concluída exibe status **Concluída**. |
| **RN04** | Não permitir cadastro sem título válido. |
| **RN05** | Cada tarefa possui `id` único gerado pelo sistema. |
| **RN06** | Apenas tarefas existentes podem ser concluídas. |

> Detalhamento consolidado em [regras-de-negocio.md](./regras-de-negocio.md).

---

## Casos de uso da versão 1

> Detalhamento completo em [casos-de-uso.md](./casos-de-uso.md#versão-1).

### UC01 — Cadastrar tarefa

1. Usuário informa título.
2. Sistema valida (RN01, RN04).
3. Sistema cria tarefa Pendente (RN02) com `id` (RN05).
4. Lista é atualizada.

**Alternativo:** título inválido → erro, sem cadastro.

### UC02 — Listar tarefas

1. Usuário acessa a tela principal.
2. Sistema exibe todas as tarefas com título e status.

**Alternativo:** lista vazia → mensagem informativa.

### UC03 — Concluir tarefa

1. Usuário aciona conclusão em tarefa Pendente.
2. Sistema altera status para Concluída (RN03).
3. Interface reflete o novo status.

**Alternativo:** id inexistente → erro (RN06).

---

## Modelo de dados (v1)

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| id | string | UUID |
| titulo | string | Obrigatório |
| status | enum | `Pendente` \| `Concluída` |

---

## Critérios de aceite (v1)

| ID | Cenário | Resultado esperado |
|----|---------|-------------------|
| CT01 | Cadastro com título válido | Status Pendente |
| CT02 | Cadastro sem título | Rejeitado |
| CT03 | Listagem com N tarefas | Retorna N itens |
| CT04 | Conclusão de pendente | Status Concluída |

---

## Implementação de referência (v1)

A primeira implementação (Python/Flask) está documentada como referência histórica. A versão atual do repositório implementa a **especificação v2** em TypeScript.
