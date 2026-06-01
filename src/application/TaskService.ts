/**
 * Casos de uso RF01–RF08 — camada de aplicação.
 */

import { TarefaNaoEncontradaError } from "../domain/errors.js";
import {
  Task,
  type PrioridadeTarefa,
  type StatusTarefa,
} from "../domain/Task.js";
import type { TaskRepository } from "./TaskRepository.js";

export type FiltroTarefa = "todas" | "pendentes" | "concluidas";

export class TaskService {
  constructor(private readonly repository: TaskRepository) {}

  async inicializar(): Promise<void> {
    await this.repository.carregar();
  }

  /** RF01 */
  async criarTarefa(
    titulo: string,
    prioridade?: PrioridadeTarefa
  ): Promise<Task> {
    const tarefa = Task.criar(titulo, prioridade);
    this.repository.salvar(tarefa);
    await this.repository.persistir();
    return tarefa;
  }

  /** RF02 + RF07 + RN08 */
  listarTarefas(filtro: FiltroTarefa = "todas"): Task[] {
    const todas = this.repository.listarTodas();
    if (filtro === "pendentes") {
      return todas.filter((t) => t.status === "Pendente");
    }
    if (filtro === "concluidas") {
      return todas.filter((t) => t.status === "Concluída");
    }
    return todas;
  }

  /** RF03 */
  async concluirTarefa(id: string): Promise<Task> {
    const tarefa = this.obterOuFalhar(id);
    if (tarefa.status !== "Concluída") {
      tarefa.concluir();
      this.repository.atualizar(tarefa);
      await this.repository.persistir();
    }
    return tarefa;
  }

  /** RF04 + RF06 */
  async editarTarefa(
    id: string,
    dados: {
      titulo?: string;
      prioridade?: PrioridadeTarefa;
      status?: StatusTarefa;
    }
  ): Promise<Task> {
    const tarefa = this.obterOuFalhar(id);
    tarefa.atualizar(dados);
    this.repository.atualizar(tarefa);
    await this.repository.persistir();
    return tarefa;
  }

  /** RF05 */
  async excluirTarefa(id: string): Promise<void> {
    this.obterOuFalhar(id);
    this.repository.excluir(id);
    await this.repository.persistir();
  }

  /** Utilitário para testes — limpa persistência. */
  async resetarTodas(): Promise<void> {
    const repo = this.repository as TaskRepository & { limpar?: () => void };
    if (typeof repo.limpar === "function") {
      repo.limpar();
      await this.repository.persistir();
    }
  }

  private obterOuFalhar(id: string): Task {
    const tarefa = this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new TarefaNaoEncontradaError(id);
    }
    return tarefa;
  }
}
