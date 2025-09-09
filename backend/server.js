// backend/server.js
import express from "express";
import cors from "cors";
import { initDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

let db;

// --- Rutas ---
app.get("/tasks", async (_req, res) => {
  try {
    const rows = await db.all(
      "SELECT id, text, done FROM Tasks ORDER BY id DESC"
    );
    // done: 0/1 -> boolean
    res.json(rows.map(r => ({ ...r, done: !!r.done })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const text = (req.body?.text || "").trim();
    if (!text) return res.status(400).json({ error: "text requerido" });

    const result = await db.run("INSERT INTO Tasks (text) VALUES (?)", [text]);
    res.status(201).json({ id: result.lastID });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.run("UPDATE Tasks SET done = 1 - done WHERE id = ?", [id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Regla que querías: si estaba done=1 y se borra -> archivar en CompletedTasks.
// Si no estaba done -> borrar para siempre.
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const row = await db.get("SELECT text, done FROM Tasks WHERE id = ?", [id]);
    if (!row) return res.status(404).json({ error: "no existe" });

    if (row.done) {
      await db.run(
        "INSERT INTO CompletedTasks (original_task_id, text) VALUES (?, ?)",
        [id, row.text]
      );
    }

    await db.run("DELETE FROM Tasks WHERE id = ?", [id]);
    res.json({ deleted: id, archived: !!row.done });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/completed", async (_req, res) => {
  try {
    const rows = await db.all(
      "SELECT id, original_task_id, text, completed_at FROM CompletedTasks ORDER BY id DESC"
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Boot ---
const PORT = 3001;
(async () => {
  db = await initDb();
  app.listen(PORT, () =>
    console.log(`Backend (SQLite) escuchando en http://localhost:${PORT}`)
  );
})();
