import { getPool } from 'coze-coding-dev-sdk';

const SQL = `
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" serial PRIMARY KEY,
  "title" varchar(500) NOT NULL,
  "mode" varchar(20) NOT NULL DEFAULT 'basic',
  "target" text,
  "deadline" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "tasks_mode_idx" ON "tasks" ("mode");
CREATE INDEX IF NOT EXISTS "tasks_created_at_idx" ON "tasks" ("created_at");

CREATE TABLE IF NOT EXISTS "task_steps" (
  "id" serial PRIMARY KEY,
  "task_id" integer NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "title" varchar(500) NOT NULL,
  "description" text,
  "order_index" integer NOT NULL DEFAULT 0,
  "completed" boolean NOT NULL DEFAULT false,
  "planned_time" timestamp with time zone,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone
);

CREATE INDEX IF NOT EXISTS "task_steps_task_id_idx" ON "task_steps" ("task_id");
CREATE INDEX IF NOT EXISTS "task_steps_order_idx" ON "task_steps" ("task_id", "order_index");
`;

export async function ensureSchema(): Promise<void> {
  try {
    const pool = await getPool();
    const client = await pool.connect();
    try {
      await client.query(SQL);
      console.log('[migrate] schema ensured (tasks, task_steps)');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[migrate] failed to ensure schema:', (err as Error).message);
  }
}
