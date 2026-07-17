import { user } from "@repo/db/schema";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

/**
 * Notes — the example module's user-owned table. References the core `user`
 * table from @repo/db so rows are scoped to their owner and cascade on delete.
 * drizzle-kit picks this file up via the module schema glob in @repo/db.
 */
export const note = pgTable("note", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text().notNull(),
  body: text().notNull().default(""),
  createdAt: timestamp().notNull().defaultNow(),
});

export type Note = typeof note.$inferSelect;
