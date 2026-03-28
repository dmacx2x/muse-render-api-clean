import { neon } from "@neondatabase/serverless";

let sqlInstance;

export function getDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  if (!sqlInstance) {
    console.log("⚡ Initializing DB...");
    sqlInstance = neon(process.env.DATABASE_URL);
  }

  return sqlInstance;
}