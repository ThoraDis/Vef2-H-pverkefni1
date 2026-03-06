import pg from "pg";
import type { Todo } from "../types.js";
import type { TodoItem } from "./validation.js";
/**
 * Gets a PostgreSQL connection pool.
 * @returns Connection pool
 */
function getPool(): pg.Pool {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString: DATABASE_URL,
  });

  pool.on("error", (err: Error) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
  });

  return pool;
}

/**
 * Run a query against the database.
 * Generic to allow typing the result rows.
 * @param q Query to run.
 * @param values Values to parameterize the query with.
 * @returns Query result.
 */
async function query<T extends pg.QueryResultRow>(
  q: string,
  values: unknown[] = [],
): Promise<pg.QueryResult<T> | null> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    return await client.query<T>(q, values);
  } catch (err) {
    console.error("Database query error", err);
    return null;
  } finally {
    client.release();
  }
}

/**
 * Initialize the database by creating necessary table.
 * @returns True if the initialization succeeded, false otherwise.
 */
export async function init(): Promise<boolean> {
  // búum til töfluna okkar ef hún er ekki til

  const q =
    "  CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, title VARCHAR(255) NOT NULL, finished BOOLEAN NOT NULL DEFAULT false, created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)";
  const results = await query(q);

  if (results) {
    return true;
  }

  return false;
}

/**
 * Get all todo items from the database.
 * @returns All todo items, or null on error.
 */
export async function listTodos(): Promise<Todo[] | null> {
  // SELECT id, title, finished FROM todos ORDER BY finished ASC, created DESC
  const results = await query(
    "SELECT id, title, finished FROM todos ORDER BY finished ASC, created DESC",
  );

  if (results) {
    return results.rows as Todo[];
  }

  return null;
}

/**
 * Create a new todo item in the database.
 * @param title Title of the todo item to create.
 * @returns Created todo item or null on error.
 */
export async function createTodo(todoItem: TodoItem): Promise<Todo | null> {
  // INSERT INTO todos (title) VALUES ($1) RETURNING id, title, finished

  const q =
    "INSERT INTO todos (title) VALUES ($1) RETURNING id, title, finished";

  const result = await query<Todo>(q, [todoItem.title]);

  const row = result?.rows[0];

  if (!row) {
    console.error("query success but no returned rows");
    return null;
  }
  return row;
}

/**
 * Update a todo item in the database.
 * @param id ID of the todo item to update.
 * @param title New title of the todo item.
 * @param finished New finished status of the todo item.
 * @returns Updated todo item or null on error.
 */
export async function updateTodo(
  id: number,
  title: string,
  finished: boolean,
): Promise<Todo | null> {
  // UPDATE todos SET title = $1, finished = $2 WHERE id = $3 RETURNING id, title, finished

  const q =
    "UPDATE todos SET title = $1, finished = $2 WHERE id = $3 RETURNING id, title, finished";

  const result = await query<Todo>(q, [title, finished, id]);

  const row = result?.rows[0];

  if (!row) {
    console.error("query success but no returned rows");
    return null;
  }
  return row;
}

/**
 * Delete a todo item from the database.
 * @param id ID of the todo item to delete.
 * @returns True if the todo item was deleted, false if not found, or null on error.
 */
export async function deleteTodo(id: number): Promise<boolean | null> {
  // DELETE FROM todos WHERE id = $1
  const q = "DELETE FROM todos WHERE id = $1";

  const result = await query(q, [id]);

  if (!result) {
    console.error(`Gat ekki eytt verkefni með id=${id}`);
    return null;
  }

  if (result.rowCount === 0) {
    return false;
  }
  return true;
}

/**
 * Get a todo item from the database.
 * @param id ID of the todo item to get.
 * @returns The todo item, or null on error or not found.
 */
export async function getTodo(id: number): Promise<Todo | null> {
  // DELETE FROM todos WHERE id = $1
  const q = "SELECT * FROM todos WHERE id = $1";

  const result = await query<Todo>(q, [id]);

  const row = result?.rows[0];

  if (!row) {
    console.error(`Gat ekki fundið verkefni með id=${id}`);
    return null;
  }

  return row;
}

/**
 * Delete all finished todo items from the database.
 * @returns Number of deleted todo items, or null on error.
 */
export async function deleteFinishedTodos(): Promise<number | null> {
  // DELETE FROM todos WHERE finished = true

  const q = "DELETE FROM todos WHERE finished = true";

  const result = await query(q);

  if (!result) {
    console.error("query success but no returned rows");
    return null;
  }

  return result.rowCount;
}
