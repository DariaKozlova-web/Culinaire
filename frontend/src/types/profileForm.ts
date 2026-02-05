import type { User } from "./user";

export type ProfileForm = Pick<User, "name"> & {
  // Add any additional fields needed for the form
  image?: string | null;
};
