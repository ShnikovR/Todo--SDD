/**
 * Cliente To-Do — consome API REST (sem lógica de negócio complexa).
 */

const API = "/api";

let filtroAtual = "todas";

const els = {
  alert: document.getElementById("alert"),
  formCriar: document.getElementById("form-criar"),
  inputTitulo: document.getElementById("input-titulo"),
  selectPrioridadeCriar: document.getElementById("select-prioridade-criar"),
  taskList: document.getElementById("task-list"),
  emptyState: document.getElementById("empty-state"),
  dialogEditar: document.getElementById("dialog-editar"),
  formEditar: document.getElementById("form-editar"),
  editId: document.getElementById("edit-id"),
  editTitulo: document.getElementById("edit-titulo"),
  editPrioridade: document.getElementById("edit-prioridade"),
  btnCancelarEditar: document.getElementById("btn-cancelar-editar"),
};

function showAlert(message, type = "error") {
  els.alert.textContent = message;
  els.alert.className = `alert alert--${type}`;
  els.alert.hidden = false;
  setTimeout(() => {
    els.alert.hidden = true;
  }, 4000);
}

async function fetchTarefas() {
  const res = await fetch(`${API}/tarefas?filtro=${filtroAtual}`);
  if (!res.ok) throw new Error("Falha ao carregar tarefas");
  return res.json();
}

function prioridadeClass(p) {
  return `prioridade prioridade--${p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
}

function renderTarefas(tarefas) {
  els.taskList.innerHTML = "";
  els.emptyState.hidden = tarefas.length > 0;

  for (const t of tarefas) {
    const li = document.createElement("li");
    li.className = `task-item task-item--${t.status === "Concluída" ? "done" : "pending"}`;
    li.dataset.testid = "task-item";
    li.dataset.id = t.id;

    const isDone = t.status === "Concluída";

    li.innerHTML = `
      <div class="task-info">
        <span class="task-title" data-testid="task-title-${t.id}">${escapeHtml(t.titulo)}</span>
        <span class="task-meta">
          <span class="task-status" data-testid="task-status-${t.id}">${t.status}</span>
          <span class="${prioridadeClass(t.prioridade)}" data-testid="task-prioridade-${t.id}">${t.prioridade}</span>
        </span>
      </div>
      <div class="task-actions">
        <button type="button" class="btn-edit" data-testid="btn-editar-${t.id}" data-id="${t.id}">Editar</button>
        <button type="button" class="btn-delete" data-testid="btn-excluir-${t.id}" data-id="${t.id}">Excluir</button>
        ${
          !isDone
            ? `<button type="button" class="btn-conclude" data-testid="btn-concluir-${t.id}" data-id="${t.id}">Concluir</button>`
            : ""
        }
      </div>
    `;
    els.taskList.appendChild(li);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function load() {
  try {
    const tarefas = await fetchTarefas();
    renderTarefas(tarefas);
  } catch {
    showAlert("Erro ao carregar tarefas.");
  }
}

els.formCriar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = els.inputTitulo.value;
  const prioridade = els.selectPrioridadeCriar.value;

  const res = await fetch(`${API}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, prioridade }),
  });

  if (!res.ok) {
    const data = await res.json();
    showAlert(data.erro || "Erro ao cadastrar.", "error");
    return;
  }

  els.inputTitulo.value = "";
  showAlert("Tarefa cadastrada com sucesso.", "success");
  await load();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filtroAtual = btn.dataset.filtro;
    await load();
  });
});

els.taskList.addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  const id = target.dataset.id;
  if (!id) return;

  if (target.classList.contains("btn-conclude")) {
    const res = await fetch(`${API}/tarefas/${id}/concluir`, { method: "PATCH" });
    if (res.ok) {
      showAlert("Tarefa concluída.", "success");
      await load();
    }
    return;
  }

  if (target.classList.contains("btn-delete")) {
    if (!confirm("Deseja excluir esta tarefa?")) return;
    const res = await fetch(`${API}/tarefas/${id}`, { method: "DELETE" });
    if (res.ok) {
      showAlert("Tarefa excluída.", "success");
      await load();
    }
    return;
  }

  if (target.classList.contains("btn-edit")) {
    const item = target.closest(".task-item");
    const titleEl = item?.querySelector(".task-title");
    const prioridadeEl = item?.querySelector("[class*='prioridade']");
    els.editId.value = id;
    els.editTitulo.value = titleEl?.textContent ?? "";
    els.editPrioridade.value = prioridadeEl?.textContent ?? "Média";
    els.dialogEditar.showModal();
  }
});

els.btnCancelarEditar.addEventListener("click", () => els.dialogEditar.close());

els.formEditar.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = els.editId.value;
  const res = await fetch(`${API}/tarefas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: els.editTitulo.value,
      prioridade: els.editPrioridade.value,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    showAlert(data.erro || "Erro ao editar.", "error");
    return;
  }

  els.dialogEditar.close();
  showAlert("Tarefa atualizada.", "success");
  await load();
});

load();
