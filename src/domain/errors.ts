/** Exceções de domínio — RN01, RN02, RN05, RN06 */

export class TituloInvalidoError extends Error {
  constructor(message = "O título da tarefa é obrigatório.") {
    super(message);
    this.name = "TituloInvalidoError";
  }
}

export class TarefaNaoEncontradaError extends Error {
  constructor(id: string) {
    super(`Tarefa com id '${id}' não encontrada.`);
    this.name = "TarefaNaoEncontradaError";
  }
}
