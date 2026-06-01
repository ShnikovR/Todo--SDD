import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { JsonFileTaskRepository } from "../infrastructure/JsonFileTaskRepository.js";
import { Task } from "../domain/Task.js";

describe("JsonFileTaskRepository", () => {
  let tempDir: string;
  let filePath: string;
  let repo: JsonFileTaskRepository;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "todo-repo-"));
    filePath = path.join(tempDir, "tasks.json");
    repo = new JsonFileTaskRepository(filePath);
    await repo.carregar();
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("persiste e recarrega tarefas", async () => {
    const t = Task.criar("Salvar");
    repo.salvar(t);
    await repo.persistir();

    const repo2 = new JsonFileTaskRepository(filePath);
    await repo2.carregar();
    expect(repo2.listarTodas()).toHaveLength(1);
    expect(repo2.buscarPorId(t.id)?.titulo).toBe("Salvar");
  });

  it("limpar remove todas as entradas", async () => {
    repo.salvar(Task.criar("A"));
    repo.limpar();
    await repo.persistir();
    const content = await readFile(filePath, "utf-8");
    expect(JSON.parse(content)).toEqual([]);
  });
});
