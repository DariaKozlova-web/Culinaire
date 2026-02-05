import type { Category } from "../types/category";

const API_URL: string | undefined = import.meta.env.VITE_APP_SERVER_URL as
  | string
  | undefined;
if (!API_URL)
  throw new Error("API URL is required, are you missing a .env file?");
const baseURL: string = `${API_URL}/categories`;

export const createCategory = async (formData: FormData): Promise<Category> => {
  const res = await fetch(baseURL, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create category");
  }
  //Da
  const data: Category = await res.json();
  return data;
};

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(baseURL);

  if (!res.ok) throw new Error("Failed to fetch categories");

  const data: Category[] = await res.json();
  return data;
};

export async function getRandomCategories(limit = 4) {
  const res = await fetch(`${API_URL}/categories/random?limit=${limit}`);

  if (!res.ok) throw new Error("Failed to fetch random categories");

  const data: Category[] = await res.json();
  return data;
}

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await fetch(`${baseURL}/${id}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch category");
  }

  const data: Category = await res.json();
  return data;
};

export const updateCategoryById = async (
  id: string,
  formData: FormData,
): Promise<Category> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to update category");
  }
  //Da
  const data: Category = await res.json();
  return data;
};

export const deleteCategoryById = async (id: string): Promise<void> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete category");
  }
};
