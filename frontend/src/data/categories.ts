import type { Category } from "../types/category";

const API_URL: string | undefined = import.meta.env.VITE_APP_SERVER_URL as
  | string
  | undefined;
if (!API_URL)
  throw new Error("API URL is required, are you missing a .env file?");
const baseURL: string = `${API_URL}/categories`;

type FormData = Omit<Category, "_id">;

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(baseURL);
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the categories");
    }
    throw new Error(errorData.error);
  }
  const data: Category[] = await res.json();
  return data;
};

export const createCategory = async (formData: FormData): Promise<Category> => {
  const res = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while creating the category");
    }
    throw new Error(errorData.error);
  }
  const data: Category = await res.json();
  return data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await fetch(`${baseURL}/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the category");
    }
    throw new Error(errorData.error);
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while updating the category",
    );
  }

  const data: Category = await res.json();
  return data;
};

export const deleteCategoryById = async (id: string): Promise<void> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while deleting the category",
    );
  }
};
