"""Rotas HTTP — expõem RF01, RF02 e RF03 à interface web."""

from flask import Flask, flash, redirect, render_template, request, url_for

from src.application import TaskService
from src.domain import TarefaNaoEncontradaError, TituloInvalidoError


def register_routes(app: Flask) -> None:
    """Registra endpoints da aplicação."""

    @app.route("/", methods=["GET"])
    def index():
        """UC02 — Exibe lista de tarefas (RF02)."""
        service: TaskService = app.config["TASK_SERVICE"]
        tarefas = service.listar_tarefas()
        return render_template("index.html", tarefas=tarefas)

    @app.route("/tarefas", methods=["POST"])
    def criar_tarefa():
        """UC01 — Cadastra nova tarefa (RF01)."""
        service: TaskService = app.config["TASK_SERVICE"]
        titulo = request.form.get("titulo", "")

        try:
            service.criar_tarefa(titulo)
            flash("Tarefa cadastrada com sucesso.", "success")
        except TituloInvalidoError as exc:
            flash(str(exc), "error")

        return redirect(url_for("index"))

    @app.route("/tarefas/<tarefa_id>/concluir", methods=["POST"])
    def concluir_tarefa(tarefa_id: str):
        """UC03 — Marca tarefa como concluída (RF03)."""
        service: TaskService = app.config["TASK_SERVICE"]

        try:
            service.concluir_tarefa(tarefa_id)
            flash("Tarefa marcada como concluída.", "success")
        except TarefaNaoEncontradaError as exc:
            flash(str(exc), "error")

        return redirect(url_for("index"))
