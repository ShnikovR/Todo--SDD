# Especificação v2 — Aplicação To-Do (OpenSpec / SDD)

**Versão:** 2.0  
**Base:** Evolução da [especificacao-v1.md](./especificacao-v1.md)

---

## Objetivo e escopo

Evoluir o To-Do com edição, exclusão, prioridade, filtros e **persistência local** entre sessões, demonstrando como uma especificação mais completa impacta arquitetura, testes e uso de IA.

### Problema resolvido na v2

- Perda de dados ao reiniciar (v1: memória);
- Ausência de priorização e segmentação (pendentes vs. concluídas);
- Impossibilidade de editar ou excluir tarefas.

---

## Novos requisitos funcionais

| ID | Requisito | Descrição |
|----|-----------|-----------|
| **RF04** | Editar tarefa | Alterar título, prioridade e/ou status. |
| **RF05** | Excluir tarefa | Remover permanentemente. |
| **RF06** | Definir prioridade | Baixa, Média, Alta. |
| **RF07** | Filtrar tarefas | Todas, Pendentes, Concluídas. |
| **RF08** | Persistir dados | Salvar em `data/tasks.json` local. |

### Requisitos mantidos da v1

RF01 (cadastrar), RF02 (listar), RF03 (concluir).

---

## Requisitos não funcionais (v2)

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF01 | Usabilidade | Feedback visual de sucesso/erro. |
| RNF02 | Performance | Filtros em memória; API &lt; 200 ms até 1000 tarefas. |
| RNF03 | Organização | Camadas + TypeScript. |
| RNF04 | Manutenibilidade | Contratos explícitos entre camadas. |
| RNF05 | Testabilidade | Cobertura unitária ≥ 80%; E2E Cypress. |
| RNF06 | Persistência | JSON local com gravação automática (RN07). |
| RNF07 | Qualidade | Domínio sem dependência de HTTP/filesystem. |

---

## Regras de negócio atualizadas

| ID | Regra | Observação |
|----|-------|------------|
| RN01 | Título obrigatório | Mantida da v1 |
| RN02 | Não permitir título vazio | Mantida (equivale RN04 v1) |
| RN03 | Status inicial **Pendente** | Mantida (equivale RN02 v1) |
| RN04 | Prioridade inicial **Média** | **Nova** |
| RN05 | Só tarefas existentes são editadas | **Nova** |
| RN06 | Só tarefas existentes são excluídas | **Nova** |
| RN07 | Persistência automática após mutações | **Nova** |
| RN08 | Filtros refletem estado atual da lista | **Nova** |

> Tabela consolidada v1 + v2: [regras-de-negocio.md](./regras-de-negocio.md).

---

## Critérios de aceite (Dado / Quando / Então)

### RF01 — Cadastrar

- **CA01.1** — Dado título válido, Quando clicar em Adicionar, Então tarefa Pendente com prioridade Média.
- **CA01.2** — Dado título e prioridade Alta, Quando salvar, Então prioridade Alta persistida.
- **CA01.3** — Dado título vazio, Quando salvar, Então erro (RN02).

### RF02 — Listar

- **CA02.1** — Dado tarefas cadastradas, Quando acessar a página, Então exibir título, status e prioridade.
- **CA02.2** — Dado lista vazia, Quando listar, Então mensagem de vazio.

### RF03 — Concluir

- **CA03.1** — Dado tarefa Pendente, Quando Concluir, Então status Concluída e dataAtualizacao atualizada.

### RF04 — Editar

- **CA04.1** — Dado tarefa existente, Quando editar título, Então persistir (RN07).
- **CA04.2** — Dado id inexistente, Quando editar, Então erro (RN05).

### RF05 — Excluir

- **CA05.1** — Dado tarefa existente, Quando excluir, Então removida da lista e do arquivo.
- **CA05.2** — Dado id inexistente, Quando excluir, Então erro (RN06).

### RF06 — Prioridade

- **CA06.1** — Dado prioridade Baixa/Média/Alta, Quando salvar, Então valor correto armazenado.

### RF07 — Filtrar

- **CA07.1** — Dado pendentes e concluídas, Quando filtro Pendentes, Então só pendentes (RN08).
- **CA07.2** — Dado filtro Concluídas sem itens, Então lista vazia com mensagem.

### RF08 — Persistência

- **CA08.1** — Dado tarefas salvas, Quando reiniciar app, Então dados carregados do JSON.

---

## Cenários de uso

### Normais

| ID | Cenário | Resultado |
|----|---------|-----------|
| SN01 | Cadastro válido | Pendente, Média |
| SN02 | Edição de título | dataAtualizacao atualizada |
| SN03 | Exclusão | Tarefa removida |
| SN04 | Conclusão | Status Concluída |
| SN05 | Filtro Pendentes | Subconjunto correto |
| SN06 | Prioridade Alta | Exibida na UI |

### Erro

| ID | Cenário | Resultado |
|----|---------|-----------|
| SE01 | Cadastro sem título | Erro RN02 |
| SE02 | Edição id inexistente | Erro RN05 |
| SE03 | Exclusão id inexistente | Erro RN06 |
| SE04 | Filtro sem resultados | Mensagem vazia |
| SE05 | Título só espaços | Inválido |

---

## Evolução da especificação

| Aspecto | v1 | v2 |
|---------|----|----|
| RF | 3 | 8 |
| RN | 6 | 8 |
| Modelo | 3 campos | 6 campos (+ prioridade, datas) |
| Persistência | Memória | JSON local |
| Testes | Unitários básicos | Vitest ≥80% + Cypress E2E |
| Spec | Documento simples | OpenSpec com CA e cenários |

### Impacto na implementação

1. **Domínio:** entidade `Task` com prioridade e timestamps.
2. **Infraestrutura:** `JsonFileTaskRepository` substitui repositório em memória.
3. **Aplicação:** métodos `editar`, `excluir`, `listar` com filtro.
4. **Apresentação:** API REST + UI com filtros e modal de edição.
5. **Testes:** 18 testes unitários + 6 cenários E2E mapeados aos CA.

### Modelo de dados (v2)

| Atributo | Tipo |
|----------|------|
| id | string (UUID) |
| titulo | string |
| status | Pendente \| Concluída |
| prioridade | Baixa \| Média \| Alta |
| dataCriacao | ISO 8601 |
| dataAtualizacao | ISO 8601 |

### Rastreabilidade

| Spec | Código |
|------|--------|
| RF01–RF08 | `src/application/TaskService.ts` |
| RN01–RN04 | `src/domain/Task.ts` |
| RN07 | `src/infrastructure/JsonFileTaskRepository.ts` |
| RF07, RN08 | `TaskService.listarTarefas(filtro)` |
| UI | `src/presentation/public/` |
