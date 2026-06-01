/**
 * Entidade Tarefa — modelo Etapa 2 (spec seção 8).
 * RN01–RN04 aplicadas em Task.criar e validações.
 */

import { randomUUID } from "node:crypto";
import { TituloInvalidoError } from "./errors.js";

export type StatusTarefa = "Pendente" | "Concluída";
export type PrioridadeTarefa = "Baixa" | "Média" | "Alta";

export interface TarefaProps {
  id: string;
  titulo: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  dataCriacao: string;
  dataAtualizacao: string;
}

export class Task {
  readonly id: string;
  titulo: string;
  status: StatusTarefa;
  prioridade: PrioridadeTarefa;
  readonly dataCriacao: string;
  dataAtualizacao: string;

  private constructor(props: TarefaProps) {
    this.id = props.id;
    this.titulo = props.titulo;
    this.status = props.status;
    this.prioridade = props.prioridade;
    this.dataCriacao = props.dataCriacao;
    this.dataAtualizacao = props.dataAtualizacao;
  }

  /** RF01 — factory com RN03 (Pendente) e RN04 (Média padrão). */
  static criar(titulo: string, prioridade?: PrioridadeTarefa): Task {
    const tituloNormalizado = titulo.trim();
    if (!tituloNormalizado) {
      throw new TituloInvalidoError();
    }

    const agora = new Date().toISOString();
    return new Task({
      id: randomUUID(),
      titulo: tituloNormalizado,
      status: "Pendente",
      prioridade: prioridade ?? "Média",
      dataCriacao: agora,
      dataAtualizacao: agora,
    });
  }

  /** Reconstituição a partir da persistência (RF08). */
  static fromJSON(data: TarefaProps): Task {
    return new Task(data);
  }

  toJSON(): TarefaProps {
    return {
      id: this.id,
      titulo: this.titulo,
      status: this.status,
      prioridade: this.prioridade,
      dataCriacao: this.dataCriacao,
      dataAtualizacao: this.dataAtualizacao,
    };
  }

  /** RF03 — RN03 inverso: status Concluída. */
  concluir(): void {
    this.status = "Concluída";
    this.touch();
  }

  /** RF04 / RF06 — atualiza campos editáveis. */
  atualizar(dados: {
    titulo?: string;
    prioridade?: PrioridadeTarefa;
    status?: StatusTarefa;
  }): void {
    if (dados.titulo !== undefined) {
      const normalizado = dados.titulo.trim();
      if (!normalizado) {
        throw new TituloInvalidoError();
      }
      this.titulo = normalizado;
    }
    if (dados.prioridade !== undefined) {
      this.prioridade = dados.prioridade;
    }
    if (dados.status !== undefined) {
      this.status = dados.status;
    }
    this.touch();
  }

  private touch(): void {
    this.dataAtualizacao = new Date().toISOString();
  }
}
