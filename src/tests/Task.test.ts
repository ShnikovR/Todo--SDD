import { describe, it, expect } from "vitest";
import { Task } from "../domain/Task.js";
import { TituloInvalidoError } from "../domain/errors.js";

describe("Task (domínio)", () => {
  it("cria tarefa válida com status Pendente e prioridade Média (RN03, RN04)", () => {
    const t = Task.criar("Estudar SDD");
    expect(t.titulo).toBe("Estudar SDD");
    expect(t.status).toBe("Pendente");
    expect(t.prioridade).toBe("Média");
    expect(t.dataCriacao).toBeTruthy();
  });

  it("rejeita título vazio (RN02)", () => {
    expect(() => Task.criar("")).toThrow(TituloInvalidoError);
    expect(() => Task.criar("   ")).toThrow(TituloInvalidoError);
  });

  it("aceita prioridade Alta no cadastro (RF06)", () => {
    const t = Task.criar("Urgente", "Alta");
    expect(t.prioridade).toBe("Alta");
  });

  it("concluir altera status (RF03)", () => {
    const t = Task.criar("Tarefa");
    const antes = t.dataAtualizacao;
    t.concluir();
    expect(t.status).toBe("Concluída");
    expect(t.dataAtualizacao >= antes).toBe(true);
  });

  it("atualizar título e prioridade (RF04, RF06)", () => {
    const t = Task.criar("Original");
    t.atualizar({ titulo: "Novo", prioridade: "Baixa" });
    expect(t.titulo).toBe("Novo");
    expect(t.prioridade).toBe("Baixa");
  });
});
