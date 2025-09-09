import { useState } from "react";
import "./App.css";
import TodoInput from "./components/TodoInput";
import TodoList  from "./components/TodoList";


export default function App() {
  // Estado centralizado: array de tareas { id, text, done }
  const [todos, setTodos] = useState([
    { id: 1, text: "Aprender React", done: false },
    { id: 2, text: "Crear To-Do básica", done: true },
  ]);

  const addTodo = (text) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, done: false },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="app">
      <h1>Mi To-Do</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList items={todos} onToggle={toggleTodo} onRemove={removeTodo} />
    </div>
  );
}
