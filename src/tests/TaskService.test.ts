import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { TaskService } from "../application/TaskService.js";
import { JsonFileTaskRepository } from "../infrastructure/JsonFileTaskRepository.js";
import { TituloInvalidoError, TarefaNaoEncontradaError } from "../domain/errors.js";

describe("TaskService", () => {
  let tempDir: string;
  let filePath: string;
  let service: TaskService;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "todo-test-"));
    filePath = path.join(tempDir, "tasks.json");
    const repo = new JsonFileTaskRepository(filePath);
    service = new TaskService(repo);
    await service.inicializar();
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("CT: cadastro válido (RF01)", async () => {
    const t = await service.criarTarefa("Tarefa A");
    expect(t.status).toBe("Pendente");
    expect(t.prioridade).toBe("Média");
  });

  it("CT: cadastro inválido sem título (RN02)", async () => {
    await expect(service.criarTarefa("")).rejects.toThrow(TituloInvalidoError);
  });

  it("CT: listagem correta (RF02)", async () => {
    await service.criarTarefa("A");
    await service.criarTarefa("B");
    expect(service.listarTarefas()).toHaveLength(2);
  });

  it("CT: edição de tarefa (RF04)", async () => {
    const t = await service.criarTarefa("Antiga");
    const atualizada = await service.editarTarefa(t.id, {
      titulo: "Nova",
      prioridade: "Alta",
    });
    expect(atualizada.titulo).toBe("Nova");
    expect(atualizada.prioridade).toBe("Alta");
  });

  it("CT: edição inexistente (RN05)", async () => {
    await expect(
      service.editarTarefa("id-fake", { titulo: "X" })
    ).rejects.toThrow(TarefaNaoEncontradaError);
  });

  it("CT: exclusão (RF05)", async () => {
    const t = await service.criarTarefa("Remover");
    await service.excluirTarefa(t.id);
    expect(service.listarTarefas()).toHaveLength(0);
  });

  it("CT: exclusão inexistente (RN06)", async () => {
    await expect(service.excluirTarefa("id-fake")).rejects.toThrow(
      TarefaNaoEncontradaError
    );
  });

  it("CT: conclusão (RF03)", async () => {
    const t = await service.criarTarefa("Concluir");
    const done = await service.concluirTarefa(t.id);
    expect(done.status).toBe("Concluída");
  });

  it("CT: alteração de prioridade (RF06)", async () => {
    const t = await service.criarTarefa("P", "Baixa");
    const updated = await service.editarTarefa(t.id, { prioridade: "Alta" });
    expect(updated.prioridade).toBe("Alta");
  });

  it("CT: filtro pendentes e concluídas (RF07, RN08)", async () => {
    const a = await service.criarTarefa("Pendente");
    const b = await service.criarTarefa("Outra");
    await service.concluirTarefa(b.id);

    expect(service.listarTarefas("pendentes")).toHaveLength(1);
    expect(service.listarTarefas("pendentes")[0].id).toBe(a.id);
    expect(service.listarTarefas("concluidas")).toHaveLength(1);
    expect(service.listarTarefas("concluidas")[0].id).toBe(b.id);
  });

  it("CT: persistência em arquivo (RF08, RN07)", async () => {
    await service.criarTarefa("Persistida");
    const raw = await readFile(filePath, "utf-8");
    const lista = JSON.parse(raw) as { titulo: string }[];
    expect(lista).toHaveLength(1);
    expect(lista[0].titulo).toBe("Persistida");

    const repo2 = new JsonFileTaskRepository(filePath);
    const service2 = new TaskService(repo2);
    await service2.inicializar();
    expect(service2.listarTarefas()[0].titulo).toBe("Persistida");
  });
});
