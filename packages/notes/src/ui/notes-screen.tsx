import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Kicker, SectionHeader } from "@repo/ui/components/rams-core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { addNote, editNote, getNotes, removeNote } from "../server";

const notesKey = ["notes"] as const;

/** The notes module screen: list + create + inline edit + delete, styled with Rams components. */
export function NotesScreen() {
  const queryClient = useQueryClient();
  const notesQuery = useQuery({ queryKey: notesKey, queryFn: () => getNotes() });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: notesKey });
  const onError = (error: Error) => toast.error(error.message);

  const addMutation = useMutation({
    mutationFn: (input: { title: string; body: string }) => addNote({ data: input }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      invalidate();
    },
    onError,
  });

  const editMutation = useMutation({
    mutationFn: (input: { id: string; title: string; body: string }) => editNote({ data: input }),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeNote({ data: { id } }),
    onSuccess: invalidate,
    onError,
  });

  const handleAdd = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    addMutation.mutate({ title, body });
  };

  const notes = notesQuery.data ?? [];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Kicker>Module</Kicker>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Notes</h1>
        <p className="text-sm text-muted-foreground">
          An example feature module — routes, UI and data in one package, toggled from the registry.
        </p>
      </div>

      <section>
        <SectionHeader number="01" label="New note" />
        <form onSubmit={handleAdd} className="flex flex-col gap-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            aria-label="Title"
          />
          <Input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Body (optional)"
            aria-label="Body"
          />
          <Button type="submit" className="w-fit" disabled={addMutation.isPending || !title.trim()}>
            {addMutation.isPending && <Loader2Icon className="animate-spin" />}
            Add note
          </Button>
        </form>
      </section>

      <section>
        <SectionHeader number="02" label={`Notes (${notes.length})`} />
        {notesQuery.isPending ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notes yet. Add your first above.</p>
        ) : (
          <div className="flex flex-col">
            {notes.map((note) => (
              <div
                key={note.id}
                className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-t border-border py-4 last:border-b"
              >
                {editingId === note.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      aria-label="Edit title"
                    />
                    <Input
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      aria-label="Edit body"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={editMutation.isPending || !editTitle.trim()}
                        onClick={() =>
                          editMutation.mutate({ id: note.id, title: editTitle, body: editBody })
                        }
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => {
                      setEditingId(note.id);
                      setEditTitle(note.title);
                      setEditBody(note.body);
                    }}
                  >
                    <span className="text-lg font-semibold text-foreground">{note.title}</span>
                    {note.body && (
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {note.body}
                      </span>
                    )}
                  </button>
                )}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Delete note"
                  disabled={removeMutation.isPending}
                  onClick={() => removeMutation.mutate(note.id)}
                >
                  <Trash2Icon />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
