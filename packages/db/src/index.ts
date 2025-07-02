import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create a lazy database instance that only initializes when accessed
let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!_db) {
    const client = postgres(process.env.DATABASE_URL);
    _db = drizzle(client, { schema });
  }

  return _db;
}

// Export a proxy that forwards all calls to the actual db instance
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof typeof _db];
  },
});

// Re-export drizzle-orm functions to ensure version consistency
export {
  and,
  eq,
  exists,
  inArray,
  isNotNull,
  isNull,
  not,
  notExists,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
// Re-export schema for convenience
export * from "./schema";
