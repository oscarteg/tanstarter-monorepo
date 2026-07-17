import { db } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";

import { note } from "./schema";

/**
 * Data access for the notes module. Uses the shared `db` client from @repo/db
 * (the single database entry point) — no connection is opened here. Every query
 * is scoped to the owning user.
 */

export function listNotes(userId: string) {
  return db.select().from(note).where(eq(note.userId, userId)).orderBy(desc(note.createdAt));
}

export async function createNote(input: { userId: string; title: string; body: string }) {
  const [row] = await db.insert(note).values(input).returning();
  return row;
}

export async function updateNote(input: {
  userId: string;
  id: string;
  title: string;
  body: string;
}) {
  const [row] = await db
    .update(note)
    .set({ title: input.title, body: input.body })
    .where(and(eq(note.id, input.id), eq(note.userId, input.userId)))
    .returning();
  return row;
}

export async function deleteNote(input: { userId: string; id: string }) {
  await db.delete(note).where(and(eq(note.id, input.id), eq(note.userId, input.userId)));
}
