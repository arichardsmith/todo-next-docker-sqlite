import { join } from "node:path";
import { packageDirectorySync } from "pkg-dir";

export const DB_ROOT = join(packageDirectorySync() ?? "", "./database/");

export const DB_PATH = process.env.DB_PATH ?? join(DB_ROOT, "data.sqlite");
