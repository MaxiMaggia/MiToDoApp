import { useEffect, useState } from "react";
import "./App.css";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

const API = "http://localhost:3001";

export default function App() {
  // Estado centralizado: array de tareas { id, text, done }
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Cargar tareas desde el backend al montar
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/tasks`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json(); // [{ id, text, done }, ...]
        setTodos(data);
      } catch (e) {
        setErr("No pude cargar tareas: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Crear tarea
  const addTodo = async (text) => {
    try {
      const r = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const { id } = await r.json();
      setTodos((prev) => [{ id, text, done: false }, ...prev]);
    } catch (e) {
      setErr("No pude crear la tarea: " + e.message);
    }
  };

  // Tildar / destildar
  const toggleTodo = async (id) => {
    try {
      const r = await fetch(`${API}/tasks/${id}/toggle`, { method: "PATCH" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    } catch (e) {
      setErr("No pude actualizar la tarea: " + e.message);
    }
  };

  // Borrar (si estaba done=true, el backend la archiva; si no, la borra)
  const removeTodo = async (id) => {
    try {
      const r = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setErr("No pude borrar la tarea: " + e.message);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Mi To-Do</h1>
      {err && <p style={{ color: "#ef4444" }}>{err}</p>}
      <TodoInput onAdd={addTodo} />
      <TodoList items={todos} onToggle={toggleTodo} onRemove={removeTodo} />
    </div>
  );
}
