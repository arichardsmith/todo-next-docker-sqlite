import { join } from "node:path";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import Database from "better-sqlite3";

import { DB_PATH, DB_ROOT } from "$/lib/data/config";

const DB_SCHEMA = join(DB_ROOT, "schema.sql");

// Remove old db if it already exists. We don't care about preserving data for this POC as we don't support migrations.
if (existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
}

const db = new Database(DB_PATH);

const schema_data = readFileSync(DB_SCHEMA, "utf8");

db.exec(schema_data);
