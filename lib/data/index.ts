import { join } from "node:path";
import Database, {
  type Database as SQLiteDB,
  type Statement,
} from "better-sqlite3";
import dedent from "dedent";
import { packageDirectorySync } from "pkg-dir";

import type { Todo } from "./types";
export type { Todo } from "./types";

let database_instance: TodoDatabase;

export function getTodoDatabase(): TodoDatabase {
  if (database_instance === undefined) {
    const db_path =
      process.env.DB_PATH ??
      join(packageDirectorySync() ?? "", "./database/data.sqlite");

    database_instance = new TodoDatabase(new Database(db_path));
  }

  return database_instance;
}

export class TodoDatabase {
  private create_statement: Statement;
  private get_statement: Statement;
  private update_statement: Statement;
  private delete_statement: Statement;
  private db: SQLiteDB;

  constructor(db: SQLiteDB) {
    this.db = db;

    // This needs to be run before prepare
    this.initDB();

    this.create_statement = db.prepare(
      "INSERT INTO todos (title, complete) VALUES (?, FALSE)",
    );
    this.get_statement = db.prepare("SELECT id, title, complete FROM todos");
    this.update_statement = db.prepare(
      "UPDATE todos SET title = @title, complete = @complete WHERE id = @id",
    );
    this.delete_statement = db.prepare("DELETE FROM todos WHERE id = ?");
  }

  initDB() {
    this.db.exec(dedent`
      CREATE TABLE IF NOT EXISTS todos
      (
        id integer primary key autoincrement,
        title text,
        complete boolean
      )
    `);
  }

  create(title: string): Todo {
    const res = this.create_statement.run(title);

    return {
      id: Number(res.lastInsertRowid),
      title,
      complete: false,
    };
  }

  getAll(): Todo[] {
    const res = this.get_statement.all();

    return res.map(parseRow);
  }

  update(new_todo: Todo): Todo | undefined {
    const res = this.update_statement.run({
      id: new_todo.id,
      title: new_todo.title,
      complete: new_todo.complete ? 1 : 0, // SQLite doesn't support booleans
    });

    if (res.changes !== 1) {
      return undefined;
    }

    return new_todo;
  }

  delete(id: number) {
    const res = this.delete_statement.run(id);

    if (res.changes !== 1) {
      throw new Error(`Failed to delete item with id ${id}`);
    }
  }

  closeDB() {
    this.db.close();
  }
}

function parseRow(input: any): Todo {
  return {
    id: typedInvariant(input.id, "id", "number"),
    title: typedInvariant(input.title, "title", "string"),
    complete: typedInvariant(input.complete, "complete", "boolean"),
  };
}

function typedInvariant(value: any, name: string, type: "number"): number;
function typedInvariant(value: any, name: string, type: "string"): string;
function typedInvariant(value: any, name: string, type: "boolean"): boolean;
function typedInvariant(
  value: any,
  name: string,
  type: "number" | "string" | "boolean",
) {
  const actual_type = typeof value;

  // Handle bigint edgecase
  if (actual_type === "bigint" && type === "number") {
    return Number(value);
  }

  // Handle booleans, which sqlite stores as 0 or 1
  if (type === "boolean" && actual_type === "number") {
    if (value === 0) return false;
    if (value === 1) return true;

    throw new Error(`Expected ${name} to be boolean but got number > 1`);
  }

  if (actual_type !== type) {
    throw new Error(`Expected ${name} to be ${type} but got ${actual_type}`);
  }

  return value;
}
