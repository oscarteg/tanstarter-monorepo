import { authMiddleware } from "@repo/auth/tanstack/middleware";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createNote, deleteNote, listNotes, updateNote } from "./data";

/**
 * Server functions for the notes module. `authMiddleware` forces authentication
 * and injects the current `user` into context, so every handler is user-scoped.
 * Input is parsed with Valibot (parse-don't-validate).
 */

const NoteInput = v.object({
  title: v.pipe(v.string(), v.trim(), v.minLength(1, "Title is required.")),
  body: v.pipe(v.string(), v.trim()),
});

export const getNotes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listNotes(context.user.id));

export const addNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => v.parse(NoteInput, data))
  .handler(async ({ context, data }) =>
    createNote({ userId: context.user.id, title: data.title, body: data.body }),
  );

export const editNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => v.parse(v.object({ id: v.string(), ...NoteInput.entries }), data))
  .handler(async ({ context, data }) =>
    updateNote({ userId: context.user.id, id: data.id, title: data.title, body: data.body }),
  );

export const removeNote = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: unknown) => v.parse(v.object({ id: v.string() }), data))
  .handler(async ({ context, data }) => {
    await deleteNote({ userId: context.user.id, id: data.id });
    return { id: data.id };
  });
