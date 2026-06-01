/**
 * Servidor Express — ponto de entrada Etapa 2.
 */

import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TaskService } from "../application/TaskService.js";
import { JsonFileTaskRepository } from "../infrastructure/JsonFileTaskRepository.js";
import { createTaskRouter } from "./routes.js";

const projectRoot = process.cwd();
const dataFile =
  process.env.TASKS_FILE ?? path.join(projectRoot, "data", "tasks.json");

const repository = new JsonFileTaskRepository(dataFile);
const taskService = new TaskService(repository);

const app = express();
app.use(express.json());

const publicDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "public"
);
app.use(express.static(publicDir));

app.use("/api", createTaskRouter(taskService));

export { app, taskService, repository, dataFile };

async function bootstrap(): Promise<void> {
  await taskService.inicializar();
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, "127.0.0.1", () => {
    console.log(`todo-sdd em http://127.0.0.1:${port}`);
  });
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
