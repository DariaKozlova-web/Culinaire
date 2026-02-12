import type { Contact } from "../types/contact";

const API_URL = import.meta.env.VITE_APP_SERVER_URL;

if (!API_URL) {
  throw new Error("API URL is required, are you missing a .env file?");
}

export const sendContactMessage = async (
  formData: Contact,
): Promise<{ success: boolean }> => {
  const res = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to send a message");
  }

  return await res.json();
};
