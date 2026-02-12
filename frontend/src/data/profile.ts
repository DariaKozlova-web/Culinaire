import type { User } from "@/types/user";
import { serverURL } from "@/utils";

export const updateProfile = async (formData: FormData): Promise<User> => {
  const res = await fetch(`${serverURL}/profile`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while updating the profile",
    );
  }

  const data: User = await res.json();
  return data;
};

export function updateProfileField<T>(
  field: string,
  value: T,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
) {
  const formData = new FormData();
  const json = JSON.stringify(value);
  formData.append(field, json);
  updateProfile(formData)
    .then((updatedUser) => {
      setUser(updatedUser);
    })
    .catch((error) => {
      console.error(`Failed to update ${field}`, error);
    });
}
