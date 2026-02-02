const API_URL: string | undefined = import.meta.env.VITE_APP_SERVER_URL as
  | string
  | undefined;
if (!API_URL)
  throw new Error("API URL is required, are you missing a .env file?");
const baseURL: string = `${API_URL}/chefs`;

type FormData = Omit<Chef, "_id">;

export const getAllChefs = async (): Promise<Chef[]> => {
  const res = await fetch(baseURL);
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the chefs");
    }
    throw new Error(errorData.error);
  }
  const data: Chef[] = await res.json();
  return data;
};

export const createChef = async (formData: FormData): Promise<Chef> => {
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
      throw new Error("An error occurred while creating the chef");
    }
    throw new Error(errorData.error);
  }
  const data: Chef = await res.json();
  return data;
};

export const getChefById = async (id: string): Promise<Chef> => {
  const res = await fetch(`${baseURL}/${id}`);
  if (!res.ok) {
    const errorData = await res.json();
    if (!errorData.error) {
      throw new Error("An error occurred while fetching the chef");
    }
    throw new Error(errorData.error);
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while updating the chef",
    );
  }

  const data: Chef = await res.json();
  return data;
};

export const deleteChefById = async (id: string): Promise<void> => {
  const res = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while deleting the chef",
    );
  }
};
