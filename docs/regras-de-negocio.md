# Regras de Negócio — To-Do SDD

Consolidação das regras das especificações v1 e v2.

---

## Versão 1

| ID | Regra | Validação |
|----|-------|-----------|
| **RN01** | Título obrigatório (não vazio após trim) | `Task.criar()` / domínio |
| **RN02** | Status inicial **Pendente** | Factory de criação |
| **RN03** | Concluída exibe status **Concluída** | `Task.concluir()` |
| **RN04** | Bloquear cadastro sem título válido | `TituloInvalidoError` |
| **RN05** | `id` único gerado pelo sistema | UUID |
| **RN06** | Só tarefas existentes podem ser concluídas | `TaskService.concluirTarefa` |

---

## Versão 2 (atualizadas e novas)

| ID | Regra | Origem | Implementação |
|----|-------|--------|---------------|
| **RN01** | Título obrigatório | v1 | `src/domain/Task.ts` |
| **RN02** | Não permitir título vazio | v1 | `TituloInvalidoError` |
| **RN03** | Status inicial **Pendente** | v1 | `Task.criar()` |
| **RN04** | Prioridade inicial **Média** | v2 | `Task.criar(prioridade?)` |
| **RN05** | Só existentes podem ser **editadas** | v2 | `TaskService.editarTarefa` |
| **RN06** | Só existentes podem ser **excluídas** | v2 | `TaskService.excluirTarefa` |
| **RN07** | Persistência automática após mutação | v2 | `repository.persistir()` |
| **RN08** | Filtros refletem lista atual | v2 | `listarTarefas(filtro)` |

---

## Mapeamento v1 → v2

| v1 | v2 equivalente |
|----|----------------|
| RN02 (Pendente) | RN03 |
| RN03 (Concluída) | Comportamento de `concluir()` |
| RN04 (bloqueio título) | RN02 |
| RN06 (concluir existente) | Mantido em `concluirTarefa` |

---

## Regras por operação

### Cadastro (RF01)

- Aplicam: RN01, RN02, RN03, RN04, RN07.

### Edição (RF04)

- Aplicam: RN01, RN02, RN05, RN07.

### Exclusão (RF05)

- Aplicam: RN06, RN07.

### Conclusão (RF03)

- Aplicam: RN03 (estado final), RN07.

### Filtro (RF07)

- Aplica: RN08.

### Prioridade (RF06)

- Aplicam: RN04 (padrão), enum validado no domínio.

---

## Mensagens de erro

| Regra violada | Exceção / HTTP |
|---------------|----------------|
| Título inválido | `TituloInvalidoError` → 400 |
| Tarefa não encontrada | `TarefaNaoEncontradaError` → 404 |
