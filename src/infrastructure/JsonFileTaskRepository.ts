/**
 * Persistência local em JSON — RF08, RN07, RNF06.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Task, type TarefaProps } from "../domain/Task.js";
import type { TaskRepository } from "../application/TaskRepository.js";

export class JsonFileTaskRepository implements TaskRepository {
  private tarefas = new Map<string, Task>();

  constructor(private readonly filePath: string) {}

  async carregar(): Promise<void> {
    try {
      const raw = await readFile(this.filePath, "utf-8");
      const lista = JSON.parse(raw) as TarefaProps[];
      this.tarefas.clear();
      for (const item of lista) {
        const tarefa = Task.fromJSON(item);
        this.tarefas.set(tarefa.id, tarefa);
      }
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        await this.ensureDir();
        await this.persistir();
        return;
      }
      throw err;
    }
  }

  listarTodas(): Task[] {
    return Array.from(this.tarefas.values());
  }

  buscarPorId(id: string): Task | undefined {
    return this.tarefas.get(id);
  }

  salvar(tarefa: Task): Task {
    this.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }

  atualizar(tarefa: Task): Task {
    if (!this.tarefas.has(tarefa.id)) {
      throw new Error(`Tarefa ${tarefa.id} não existe.`);
    }
    this.tarefas.set(tarefa.id, tarefa);
    return tarefa;
  }

  excluir(id: string): void {
    this.tarefas.delete(id);
  }

  /** Limpa todas as tarefas em memória (uso em testes E2E). */
  limpar(): void {
    this.tarefas.clear();
  }

  async persistir(): Promise<void> {
    await this.ensureDir();
    const lista = this.listarTodas().map((t) => t.toJSON());
    await writeFile(this.filePath, JSON.stringify(lista, null, 2), "utf-8");
  }

  private async ensureDir(): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
  }
}
