import type { User } from "@/types/user";
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
