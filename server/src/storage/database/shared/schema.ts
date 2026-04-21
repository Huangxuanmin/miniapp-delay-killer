import { pgTable, serial, timestamp, text, boolean, integer, index, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const tasks = pgTable(
	"tasks",
	{
		id: serial().primaryKey(),
		title: varchar("title", { length: 500 }).notNull(),
		mode: varchar("mode", { length: 20 }).notNull().default("basic"),
		target: text("target"),
		deadline: timestamp("deadline", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("tasks_mode_idx").on(table.mode),
		index("tasks_created_at_idx").on(table.created_at),
	]
);

export const taskSteps = pgTable(
	"task_steps",
	{
		id: serial().primaryKey(),
		task_id: integer("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" }),
		title: varchar("title", { length: 500 }).notNull(),
		description: text("description"),
		order_index: integer("order_index").notNull().default(0),
		completed: boolean("completed").notNull().default(false),
		planned_time: timestamp("planned_time", { withTimezone: true }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true }),
	},
	(table) => [
		index("task_steps_task_id_idx").on(table.task_id),
		index("task_steps_order_idx").on(table.task_id, table.order_index),
	]
);
