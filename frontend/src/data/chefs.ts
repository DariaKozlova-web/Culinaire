import type { Chef } from "../types/chef";
import type { Recipe } from "../types/recipe";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

if (!API_URL) {
  throw new Error("API URL is required, are you missing a .env file?");
}

export const createChef = async (formData: FormData): Promise<Chef> => {
  const res = await fetch(`${API_URL}/chefs`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create chef");
  }
  const data: Chef = await res.json();
  return data;
};

export const getAllChefs = async (): Promise<Chef[]> => {
  const res = await fetch(`${API_URL}/chefs`);

  if (!res.ok) throw new Error("Failed to fetch chefs");

  const data: Chef[] = await res.json();
  return data;
};

export const getRandomChefs = async (limit = 4) => {
  const res = await fetch(`${API_URL}/chefs/random?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch random chefs");
  return res.json();
};

export const getChefById = async (id: string): Promise<Chef> => {
  const res = await fetch(`${`${API_URL}/chefs`}/${id}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch chef");
  }

  const data: Chef = await res.json();
  return data;
};

export const updateChefById = async (
  id: string,
  formData: FormData,
): Promise<Chef> => {
  const res = await fetch(`${API_URL}/chefs/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update chef");
  }

  const data: Chef = await res.json();
  return data;
};

export const deleteChefById = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/chefs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete chef");
  }
};

export const getChefBySlug = async (slug: string): Promise<Chef> => {
  const res = await fetch(`${API_URL}/chefs/slug/${slug}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch chef");
  }

  const data: Chef = await res.json();
  return data;
};

export async function getRecipesByChefId(id: string): Promise<Recipe[]> {
  const res = await fetch(`${API_URL}/chefs/${id}/recipes`);

  if (!res.ok) {
    throw new Error("Failed to fetch chef's recipes");
  }
  return res.json();
}
