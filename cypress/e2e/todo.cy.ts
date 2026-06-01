/**
 * Testes E2E — cenários Etapa 2 (Cypress).
 */

describe("To-Do Etapa 2 — E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Cenário 1: Criar tarefa", () => {
    cy.get('[data-testid="input-titulo"]').type("Tarefa E2E criar");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="task-list"]').should("contain", "Tarefa E2E criar");
    cy.get('[data-testid="alert"]').should("contain", "sucesso");
  });

  it("Cenário 2: Editar tarefa", () => {
    cy.get('[data-testid="input-titulo"]').type("Titulo original");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="task-list"] .btn-edit').first().click();
    cy.get('[data-testid="edit-titulo"]').clear().type("Titulo editado");
    cy.get('[data-testid="btn-salvar-editar"]').click();
    cy.get('[data-testid="task-list"]').should("contain", "Titulo editado");
    cy.get('[data-testid="task-list"]').should("not.contain", "Titulo original");
  });

  it("Cenário 3: Excluir tarefa", () => {
    cy.on("window:confirm", () => true);
    cy.get('[data-testid="input-titulo"]').type("Tarefa para excluir");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="task-list"]').should("contain", "Tarefa para excluir");
    cy.get('[data-testid="task-list"] .btn-delete').first().click();
    cy.get('[data-testid="task-list"]').should("not.contain", "Tarefa para excluir");
  });

  it("Cenário 4: Marcar tarefa como concluída", () => {
    cy.get('[data-testid="input-titulo"]').type("Concluir esta");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="task-list"] .btn-conclude').first().click();
    cy.get('[data-testid="task-list"]').should("contain", "Conclu");
    cy.get('[data-testid="task-list"] .btn-conclude').should("not.exist");
  });

  it("Cenário 5: Filtrar tarefas concluídas", () => {
    cy.get('[data-testid="input-titulo"]').type("Pendente filtro");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="input-titulo"]').type("Concluida filtro");
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="task-list"] .btn-conclude').last().click();

    cy.get('[data-testid="filtro-concluidas"]').click();
    cy.get('[data-testid="task-list"]').should("contain", "Concluida filtro");
    cy.get('[data-testid="task-list"]').should("not.contain", "Pendente filtro");
  });

  it("Cenário 6: Erro ao salvar sem título", () => {
    cy.get('[data-testid="btn-adicionar"]').click();
    cy.get('[data-testid="alert"]').should("be.visible");
    cy.get('[data-testid="alert"]').should("contain", "obrigatório");
    cy.get('[data-testid="empty-state"]').should("be.visible");
  });
});
