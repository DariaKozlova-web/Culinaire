import type { Recipe } from "../types/recipe";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

if (!API_URL) {
  throw new Error("API URL is required, are you missing a .env file?");
}

export async function createRecipe(formData: FormData): Promise<Recipe> {
  const res = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create recipe');
  }

  return res.json();
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

// временно: ищем по slug из общего списка
// export async function getRecipeBySlug(slug: string): Promise<Recipe> {
//   const all = await getAllRecipes();
//   const found = all.find((r) => r.url === slug);
//   if (!found) throw new Error("Recipe not found");
//   return found;
// }

export async function getRecipeBySlug(slug: string) {
  const res = await fetch(`${API_URL}/recipes/slug/${slug}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export async function getRandomRecipes(limit = 3) {
  const res = await fetch(`${API_URL}/recipes/random?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch random recipes');
  return res.json();
}

export async function getRecipeById(id: string): Promise<Recipe> {
  const res = await fetch(`${API_URL}/recipes/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch recipe");
  }
  return res.json();
}

export async function updateRecipeById(id: string, formData: FormData): Promise<Recipe> {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update recipe");
  }

  return res.json();
}

export async function deleteRecipeById(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete recipe");
  }
}