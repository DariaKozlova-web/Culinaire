import { useAuth } from "@/contexts";
import { updateProfileField } from "@/data/profile";
import type { Recipe } from "@/types/recipe";
import type { NoteItem } from "@/types/user";
import { useEffect, useState } from "react";

interface Props {
  recipe: Recipe;
}

const Notes = ({ recipe }: Props) => {
  const { user, authLoading, setUser } = useAuth();
  const [newNote, setNewNote] = useState("");
  const [userNotes, setUserNotes] = useState<NoteItem[]>([]);
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    if (!recipe?._id || !user) return;
    const noteItems =
      user.notes?.find((note) => note.recipeId === recipe._id)?.noteItems || [];
    setUserNotes(noteItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe, user?.notes]);

  const persistNotes = (updatedNotes: NoteItem[]) => {
    if (!user || !recipe) return;
    const notes = user.notes ? user.notes : [];
    const noteIndexForRecipe = notes.findIndex(
      (note) => note.recipeId === recipe._id,
    );
    if (noteIndexForRecipe >= 0) {
      notes[noteIndexForRecipe].noteItems = updatedNotes;
    } else {
      notes.push({ recipeId: recipe._id, noteItems: updatedNotes });
    }
    updateProfileField("notes", notes, setUser);
  };

  const onSaveNote = () => {
    if (!recipe?._id) return;
    if (!user || authLoading) return;
    if (!newNote.trim()) return;

    try {
      setSavingNote(true);
      const updatedNotes = [
        ...userNotes,
        { text: newNote.trim(), createdAt: new Date() },
      ];
      persistNotes(updatedNotes);
      setNewNote("");
    } finally {
      setSavingNote(false);
    }
  };

  const onDeleteNote = (date: Date) => {
    if (!recipe?._id) return;
    const updatedNotes = userNotes.filter((note) => note.createdAt !== date);
    persistNotes(updatedNotes);
  };

  return (
    <>
      <h2 className="text-center text-3xl font-semibold text-(--text-title)">
        Your Notes
      </h2>

      <div className="mx-auto mt-8 max-w-xl">
        {userNotes.length > 0 && (
          <div className="mb-5 space-y-3">
            {userNotes.map((noteItem) => (
              <div
                key={noteItem.createdAt.toString()}
                className="flex items-start justify-between gap-4 rounded-2xl border border-(--border-soft) bg-transparent px-4 py-3 text-sm text-(--text-body)"
              >
                <div>
                  <div className="whitespace-pre-wrap">{noteItem.text}</div>
                  <div className="mt-2 text-xs text-(--text-muted)">
                    {new Date(noteItem.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteNote(noteItem.createdAt)}
                  disabled={!user || authLoading}
                  className="shrink-0 cursor-pointer rounded-xl border border-(--border-soft) px-3 py-2 text-xs font-semibold text-(--text-title) transition hover:border-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
                  title={!user ? "Login required" : ""}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={
            user ? "Write your notes here..." : "Login to write notes"
          }
          disabled={!user || authLoading}
          className="ui-input min-h-35 px-4 py-3 text-sm transition outline-none disabled:cursor-not-allowed disabled:opacity-60"
          title={!user ? "Login required" : ""}
        />

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onSaveNote}
            disabled={!user || authLoading || !newNote.trim() || savingNote}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-(--accent-olive) px-6 py-2.5 text-sm font-semibold text-(--accent-olive) transition hover:border-(--accent-wine) hover:text-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-50"
            title={!user ? "Login required" : ""}
          >
            {savingNote ? "Saving..." : "Save note"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Notes;
