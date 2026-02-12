export type NoteItem = {
  text: string;
  createdAt: Date;
};

export type Note = {
  recipeId: string;
  noteItems: NoteItem[];
};

export type User = {
  name: string;
  email: string;
  roles?: string[];
  image?: string;
  favorites?: string[];
  notes?: Note[];
};
