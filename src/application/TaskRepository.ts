import type { Task } from "../domain/Task.js";

/** Contrato de persistência — RNF03, RF08. */
export interface TaskRepository {
  carregar(): Promise<void>;
  listarTodas(): Task[];
  buscarPorId(id: string): Task | undefined;
  salvar(tarefa: Task): Task;
  atualizar(tarefa: Task): Task;
  excluir(id: string): void;
  persistir(): Promise<void>;
}
