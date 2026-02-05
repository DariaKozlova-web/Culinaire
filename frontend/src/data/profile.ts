// import type { ProfileForm } from "@/types/profileForm";
import type { User } from "@/types/user";
import { serverURL } from "@/utils";

export const updateProfile = async (formData: FormData): Promise<User> => {
  const res = await fetch(`${serverURL}/profile`, {
    method: "PUT",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify(formData),
    body: formData,
    credentials: "include",
  });

  console.log(res);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.error || "An error occurred while updating the profile",
    );
  }

  const data: User = await res.json();
  return data;
};
