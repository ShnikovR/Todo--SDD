"""Camada de aplicação — implementa RF01, RF02 e RF03."""

from __future__ import annotations

from typing import Protocol

from src.domain import Tarefa, TarefaNaoEncontradaError, TituloInvalidoError
from src.domain.task import StatusTarefa


class TaskRepository(Protocol):
    """Contrato de persistência — permite trocar implementação (RNF03)."""

    def salvar(self, tarefa: Tarefa) -> Tarefa: ...

    def listar_todas(self) -> list[Tarefa]: ...

    def buscar_por_id(self, tarefa_id: str) -> Tarefa | None: ...

    def atualizar(self, tarefa: Tarefa) -> Tarefa: ...


class TaskService:
    """
    Serviço de casos de uso da aplicação To-Do.

    Orquestra operações definidas na especificação (UC01–UC03).
    """

    def __init__(self, repository: TaskRepository) -> None:
        self._repository = repository

    def criar_tarefa(self, titulo: str) -> Tarefa:
        """
        RF01 — Cadastrar nova tarefa.

        Raises:
            TituloInvalidoError: quando título é inválido (RN04).
        """
        tarefa = Tarefa.criar(titulo)
        return self._repository.salvar(tarefa)

    def listar_tarefas(self) -> list[Tarefa]:
        """RF02 — Retorna todas as tarefas cadastradas."""
        return self._repository.listar_todas()

    def concluir_tarefa(self, tarefa_id: str) -> Tarefa:
        """
        RF03 — Marca tarefa como concluída.

        Raises:
            TarefaNaoEncontradaError: quando id não existe (RN06).
        """
        tarefa = self._repository.buscar_por_id(tarefa_id)
        if tarefa is None:
            raise TarefaNaoEncontradaError(
                f"Tarefa com id '{tarefa_id}' não encontrada."
            )

        if tarefa.status != StatusTarefa.CONCLUIDA:
            tarefa.concluir()
            return self._repository.atualizar(tarefa)

        return tarefa
