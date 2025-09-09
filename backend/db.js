// backend/db.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDb() {
  // Crea ./todo.db si no existe
  const db = await open({
    filename: "./todo.db",
    driver: sqlite3.Database,
  });

  // Buenas prácticas
  await db.exec("PRAGMA foreign_keys = ON;");

  // Esquema (idéntico en intención a lo que tenías en SQL Server)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS CompletedTasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_task_id INTEGER,
      text TEXT NOT NULL,
      completed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (original_task_id) REFERENCES Tasks(id)
    );
  `);

  return db;
}
