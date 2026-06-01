"""Factory da aplicação Flask — camada de apresentação."""

from flask import Flask

from src.application import TaskService
from src.infrastructure import MemoryTaskRepository
from src.presentation.routes import register_routes


def create_app() -> Flask:
    """Cria e configura a instância Flask com injeção de dependências."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "todo-dev-key"

    repository = MemoryTaskRepository()
    app.config["TASK_SERVICE"] = TaskService(repository)

    register_routes(app)
    return app
