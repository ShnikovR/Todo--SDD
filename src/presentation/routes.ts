/**
 * Rotas REST — camada de apresentação (RF01–RF08).
 */

import { Router, type Request, type Response } from "express";
import { TituloInvalidoError, TarefaNaoEncontradaError } from "../domain/errors.js";
import type { TaskService, FiltroTarefa } from "../application/TaskService.js";
import type { PrioridadeTarefa } from "../domain/Task.js";

const FILTROS_VALIDOS: FiltroTarefa[] = ["todas", "pendentes", "concluidas"];

export function createTaskRouter(service: TaskService): Router {
  const router = Router();

  router.get("/tarefas", (req: Request, res: Response) => {
    const filtro = (req.query.filtro as string) ?? "todas";
    const filtroNormalizado: FiltroTarefa = FILTROS_VALIDOS.includes(
      filtro as FiltroTarefa
    )
      ? (filtro as FiltroTarefa)
      : "todas";

    const tarefas = service.listarTarefas(filtroNormalizado).map((t) => t.toJSON());
    res.json(tarefas);
  });

  router.post("/tarefas", async (req: Request, res: Response) => {
    try {
      const { titulo, prioridade } = req.body as {
        titulo?: string;
        prioridade?: PrioridadeTarefa;
      };
      const tarefa = await service.criarTarefa(titulo ?? "", prioridade);
      res.status(201).json(tarefa.toJSON());
    } catch (err) {
      if (err instanceof TituloInvalidoError) {
        res.status(400).json({ erro: err.message });
        return;
      }
      throw err;
    }
  });

  router.put("/tarefas/:id", async (req: Request, res: Response) => {
    try {
      const { titulo, prioridade, status } = req.body as {
        titulo?: string;
        prioridade?: PrioridadeTarefa;
        status?: "Pendente" | "Concluída";
      };
      const tarefa = await service.editarTarefa(req.params.id, {
        titulo,
        prioridade,
        status,
      });
      res.json(tarefa.toJSON());
    } catch (err) {
      if (err instanceof TituloInvalidoError) {
        res.status(400).json({ erro: err.message });
        return;
      }
      if (err instanceof TarefaNaoEncontradaError) {
        res.status(404).json({ erro: err.message });
        return;
      }
      throw err;
    }
  });

  router.delete("/tarefas/:id", async (req: Request, res: Response) => {
    try {
      await service.excluirTarefa(req.params.id);
      res.status(204).send();
    } catch (err) {
      if (err instanceof TarefaNaoEncontradaError) {
        res.status(404).json({ erro: err.message });
        return;
      }
      throw err;
    }
  });

  router.patch("/tarefas/:id/concluir", async (req: Request, res: Response) => {
    try {
      const tarefa = await service.concluirTarefa(req.params.id);
      res.json(tarefa.toJSON());
    } catch (err) {
      if (err instanceof TarefaNaoEncontradaError) {
        res.status(404).json({ erro: err.message });
        return;
      }
      throw err;
    }
  });

  /** Utilitário para testes E2E — limpa dados (NODE_ENV=test). */
  router.post("/test/reset", async (_req: Request, res: Response) => {
    if (process.env.NODE_ENV !== "test" && process.env.ALLOW_TEST_RESET !== "1") {
      res.status(403).json({ erro: "Reset disponível apenas em ambiente de teste." });
      return;
    }
    await service.resetarTodas();
    res.status(204).send();
  });

  return router;
}
