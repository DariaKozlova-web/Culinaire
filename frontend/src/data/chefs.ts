import type { Chef } from "../types/chef";

const API_URL: string | undefined = import.meta.env.VITE_APP_SERVER_URL as
  | string
  | undefined;
if (!API_URL)
  throw new Error("API URL is required, are you missing a .env file?");
const baseURL: string = `${API_URL}/chefs`;

export const createChef = async (formData: FormData): Promise<Chef> => {
  const res = await fetch(baseURL, {
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
  const res = await fetch(baseURL);

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
  const res = await fetch(`${baseURL}/${id}`);

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
  const res = await fetch(`${baseURL}/${id}`, {
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
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to delete chef");
  }
};

export const getChefByURL = async (url: string): Promise<Chef> => {
  const res = await fetch(`${baseURL}/url/${url}`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch chef");
  }

  const data: Chef = await res.json();
  return data;
};
