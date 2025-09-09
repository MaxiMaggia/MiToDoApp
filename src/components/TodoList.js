export default function TodoList({ items, onToggle, onRemove }) {
  if (items.length === 0) {
    return <p className="empty">No hay tareas. ¡Agregá la primera! 🎯</p>;
  }

  return (
    <ul className="todo-list">
      {items.map((t) => (
        <li key={t.id} className={t.done ? "done" : ""}>
          <label>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => onToggle(t.id)}
            />
            <span>{t.text}</span>
          </label>
          <button onClick={() => onRemove(t.id)} aria-label="Borrar">
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
