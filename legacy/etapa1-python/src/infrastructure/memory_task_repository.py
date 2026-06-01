"""Repositório em memória — atende RNF02 (persistência durante execução)."""

from __future__ import annotations

from src.domain import Tarefa


class MemoryTaskRepository:
    """Armazena tarefas em dicionário Python (volátil entre reinícios)."""

    def __init__(self) -> None:
        self._tarefas: dict[str, Tarefa] = {}

    def salvar(self, tarefa: Tarefa) -> Tarefa:
        self._tarefas[tarefa.id] = tarefa
        return tarefa

    def listar_todas(self) -> list[Tarefa]:
        return list(self._tarefas.values())

    def buscar_por_id(self, tarefa_id: str) -> Tarefa | None:
        return self._tarefas.get(tarefa_id)

    def atualizar(self, tarefa: Tarefa) -> Tarefa:
        if tarefa.id not in self._tarefas:
            raise KeyError(f"Tarefa {tarefa.id} não existe no repositório.")
        self._tarefas[tarefa.id] = tarefa
        return tarefa
