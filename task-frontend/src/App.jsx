import { useState, useEffect, useCallback } from "react";

// ---------- design tokens ----------
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif";

function StatusDot({ ok }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: ok ? "#4FD1AE" : "#E8607A",
        boxShadow: ok ? "0 0 6px #4FD1AE99" : "0 0 6px #E8607A99",
        marginRight: 8,
      }}
    />
  );
}

function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span
        style={{
          display: "block",
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.06em",
          color: "#8A9891",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <input
        {...props}
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#0F1512",
          border: "1px solid #24312B",
          borderRadius: 8,
          padding: "10px 12px",
          color: "#E8EDE9",
          fontFamily: SANS,
          fontSize: 14,
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#4FD1AE")}
        onBlur={(e) => (e.target.style.borderColor = "#24312B")}
      />
    </label>
  );
}

function Button({ children, variant = "primary", style, ...props }) {
  const base = {
    fontFamily: MONO,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.02em",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: props.disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    transition: "opacity 0.15s ease",
    opacity: props.disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "#4FD1AE", color: "#0F1512" },
    ghost: {
      background: "transparent",
      color: "#8A9891",
      border: "1px solid #24312B",
    },
    danger: {
      background: "transparent",
      color: "#E8607A",
      border: "1px solid #3A2328",
    },
  };
  return (
    <button {...props} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#161F1B",
        border: "1px solid #24312B",
        borderRadius: 14,
        padding: 28,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "#2A161A",
        border: "1px solid #4A2530",
        color: "#F0A5B0",
        fontSize: 13,
        borderRadius: 8,
        padding: "10px 12px",
        marginBottom: 16,
        fontFamily: SANS,
      }}
    >
      {message}
    </div>
  );
}

// ---------- app ----------

export default function App() {
  const [apiBase, setApiBase] = useState("http://localhost:8000/api");
  const [showSettings, setShowSettings] = useState(false);

  const [screen, setScreen] = useState("login"); // login | register | dashboard
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cep: "",
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [endereco, setEndereco] = useState(null);

  const [adminStats, setAdminStats] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const authHeaders = useCallback(
    (extra = {}) => ({
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    }),
    [token]
  );

  function firstValidationError(data) {
    if (!data?.errors) return null;
    const firstKey = Object.keys(data.errors)[0];
    return data.errors[firstKey]?.[0];
  }

  async function handleRegister(e) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${apiBase}/users`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || firstValidationError(data) || `Erro ${res.status}`
        );
      }
      if (data.token) {
        setToken(data.token);
        setUser(data.user || null);
        setScreen("dashboard");
      } else {
        setScreen("login");
        setAuthError("Conta criada. Faça login para continuar.");
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.message || firstValidationError(data) || `Erro ${res.status}`
        );
      }
      setToken(data.token);
      if (data.user) setUser(data.user.data || data.user);
      setScreen("dashboard");
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  }

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/me`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUser(data.data || data);
        try {
          const cepRes = await fetch(`${apiBase}/users/endereco`, {
            headers: authHeaders(),
          });
          if (cepRes.ok) setEndereco(await cepRes.json());
        } catch {
          // endereço é opcional
        }
      }
    } catch {
      // silencioso
    }
  }, [apiBase, authHeaders]);

  const loadTasks = useCallback(async () => {
    setTasksLoading(true);
    setTasksError("");
    try {
      const res = await fetch(`${apiBase}/tasks`, { headers: authHeaders() });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Erro ${res.status}`);
      const list = Array.isArray(data) ? data : data.data || [];
      setTasks(list);
    } catch (err) {
      setTasksError(err.message);
    } finally {
      setTasksLoading(false);
    }
  }, [apiBase, authHeaders]);

  const loadAdminStats = useCallback(async () => {
    setAdminLoading(true);
    try {
      const res = await fetch(`${apiBase}/users/stats`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch {
      // Silencioso se o usuário não for admin
    } finally {
      setAdminLoading(false);
    }
  }, [apiBase, authHeaders]);

  useEffect(() => {
    if (screen === "dashboard" && token) {
      loadMe();
      loadTasks();
      loadAdminStats();
    }
  }, [screen, token, loadMe, loadTasks, loadAdminStats]);

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch(`${apiBase}/tasks`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription || null,
          due_date: newTaskDueDate || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Erro ${res.status}`);
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      loadTasks();
    } catch (err) {
      setTasksError(err.message);
    }
  }

  async function handleToggleTask(task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
    );
    try {
      const res = await fetch(`${apiBase}/tasks/${task.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
    } catch (err) {
      setTasksError(err.message);
      loadTasks();
    }
  }

  async function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      const res = await fetch(`${apiBase}/tasks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok && res.status !== 204) throw new Error(`Erro ${res.status}`);
    } catch (err) {
      setTasksError(err.message);
      loadTasks();
    }
  }

  function handleLogout() {
    try {
      fetch(`${apiBase}/logout`, {
        method: "POST",
        headers: authHeaders(),
      });
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
    setToken(null);
    setUser(null);
    setTasks([]);
    setAdminStats(null);
    setForm({ name: "", email: "", password: "", cep: "" });
    setScreen("login");
  }

  const pendingCount = tasks.filter((t) => t.status !== "completed").length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F1512",
        color: "#E8EDE9",
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px",
      }}
    >
      {/* top bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            color: "#8A9891",
            display: "flex",
            alignItems: "center",
          }}
        >
          <StatusDot ok={!!token} />
          taskApi{token ? "/dashboard" : `/${screen}`}
        </div>
        <button
          onClick={() => setShowSettings((s) => !s)}
          style={{
            background: "none",
            border: "none",
            color: "#8A9891",
            fontFamily: MONO,
            fontSize: 11,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          config
        </button>
      </div>

      {showSettings && (
        <div style={{ width: "100%", maxWidth: 480, marginBottom: 20 }}>
          <Card style={{ padding: 18 }}>
            <Field
              label="API base URL"
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder="http://localhost:8000/api"
            />
            <p
              style={{
                fontFamily: MONO,
                fontSize: 11,
                color: "#5A6660",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Espera POST /users (cadastro), POST /login (retorna token), GET
              /me, GET/POST /tasks, PUT/DELETE /tasks/{"{id}"}. Lembre de
              liberar CORS no Laravel para esta origem.
            </p>
          </Card>
        </div>
      )}

      {screen !== "dashboard" && (
        <Card style={{ width: "100%", maxWidth: 380 }}>
          <h1
            style={{
              fontFamily: MONO,
              fontSize: 18,
              margin: "0 0 4px",
              color: "#E8EDE9",
            }}
          >
            {screen === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#8A9891",
              margin: "0 0 22px",
            }}
          >
            {screen === "login"
              ? "Acesse suas tarefas."
              : "Leva menos de um minuto."}
          </p>

          <ErrorBanner message={authError} />

          <form onSubmit={screen === "login" ? handleLogin : handleRegister}>
            {screen === "register" && (
              <>
                <Field
                  label="Nome"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
                <Field
                  label="CEP"
                  type="text"
                  value={form.cep}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cep: e.target.value }))
                  }
                  placeholder="29100-000"
                  maxLength={9}
                />
              </>
            )}
            <Field
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <Field
              label="Senha"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
            />

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Button type="submit" disabled={authLoading}>
                {authLoading
                  ? "Aguarde..."
                  : screen === "login"
                  ? "Entrar"
                  : "Cadastrar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setAuthError("");
                  setScreen(screen === "login" ? "register" : "login");
                }}
              >
                {screen === "login" ? "Criar conta" : "Já tenho conta"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {screen === "dashboard" && (
        <div style={{ width: "100%", maxWidth: 480 }}>
          {/* Card do Usuário */}
          <Card style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justify: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: "#8A9891",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  usuário
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
                  {user?.name || "—"}
                </div>
                <div style={{ fontSize: 13, color: "#8A9891" }}>
                  {user?.email || ""}
                </div>
                {endereco && (
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: "#5A6660",
                      marginTop: 6,
                    }}
                  >
                    {endereco.logradouro ? `${endereco.logradouro}, ` : ""}
                    {endereco.bairro ? `${endereco.bairro} — ` : ""}
                    {endereco.localidade}/{endereco.uf}
                  </div>
                )}
              </div>
              <Button variant="danger" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </Card>

          {/* Card do Admin — Posicionado dentro da verificação do Dashboard */}
          {adminStats && (
            <Card style={{ marginBottom: 16, border: "1px solid #4FD1AE44" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: "#4FD1AE",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  painel administrativo
                </div>
                <button
                  onClick={loadAdminStats}
                  disabled={adminLoading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8A9891",
                    fontFamily: MONO,
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  {adminLoading ? "atualizando..." : "refresh"}
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: "#0F1512",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid #24312B",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: MONO,
                      fontSize: 10,
                      color: "#8A9891",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Usuários
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#E8EDE9",
                    }}
                  >
                    {adminStats.total_users ?? 0}
                  </span>
                </div>

                <div
                  style={{
                    background: "#0F1512",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid #24312B",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: MONO,
                      fontSize: 10,
                      color: "#8A9891",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Tarefas
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#4FD1AE",
                    }}
                  >
                    {adminStats.total_tasks ?? 0}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Card de Tarefas */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#E8EDE9",
                }}
              >
                tarefas
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: "#E8A33D",
                  }}
                >
                  {pendingCount} pendente{pendingCount !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={loadTasks}
                  disabled={tasksLoading}
                  aria-label="Atualizar tarefas"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#8A9891",
                    fontFamily: MONO,
                    fontSize: 11,
                    cursor: tasksLoading ? "not-allowed" : "pointer",
                    opacity: tasksLoading ? 0.5 : 1,
                    padding: 0,
                  }}
                >
                  {tasksLoading ? "atualizando..." : "refresh"}
                </button>
              </div>
            </div>

            <form
              onSubmit={handleCreateTask}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Nova tarefa..."
                  style={{
                    flex: 1,
                    boxSizing: "border-box",
                    background: "#0F1512",
                    border: "1px solid #24312B",
                    borderRadius: 8,
                    padding: "10px 12px",
                    color: "#E8EDE9",
                    fontFamily: SANS,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <Button type="submit">Add</Button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Descrição (opcional)..."
                  style={{
                    flex: 1,
                    boxSizing: "border-box",
                    background: "#0F1512",
                    border: "1px solid #24312B",
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: "#8A9891",
                    fontFamily: SANS,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  style={{
                    boxSizing: "border-box",
                    background: "#0F1512",
                    border: "1px solid #24312B",
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: "#8A9891",
                    fontFamily: SANS,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </form>

            <ErrorBanner message={tasksError} />

            {tasksLoading && (
              <p style={{ color: "#8A9891", fontSize: 13 }}>Carregando...</p>
            )}

            {!tasksLoading && tasks.length === 0 && !tasksError && (
              <p style={{ color: "#5A6660", fontSize: 13 }}>
                Nenhuma tarefa ainda. Adicione a primeira acima.
              </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {tasks.map((task) => {
                const done = task.status === "completed";
                return (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      background: "#0F1512",
                      border: "1px solid #24312B",
                      borderRadius: 8,
                    }}
                  >
                    <button
                      onClick={() => handleToggleTask(task)}
                      aria-label={
                        done ? "Marcar como pendente" : "Concluir tarefa"
                      }
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        border: `1.5px solid ${
                          done ? "#4FD1AE" : "#3A4A42"
                        }`,
                        background: done ? "#4FD1AE" : "transparent",
                        cursor: "pointer",
                        flexShrink: 0,
                        color: "#0F1512",
                        fontSize: 12,
                        lineHeight: "16px",
                      }}
                    >
                      {done ? "✓" : ""}
                    </button>
                    <span
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          color: done ? "#5A6660" : "#E8EDE9",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#5A6660",
                          }}
                        >
                          {task.description}
                        </span>
                      )}
                      {task.due_date && (
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: 11,
                            color: "#E8A33D",
                          }}
                        >
                          até{" "}
                          {new Date(task.due_date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label="Excluir tarefa"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#5A6660",
                        cursor: "pointer",
                        fontSize: 16,
                        lineHeight: 1,
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}