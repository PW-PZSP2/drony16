import { create } from "zustand";
import type { User } from "../types/auth/user";

interface AuthorizationState {
  user: User | undefined;
  actions: {
    setUser: (user: User | undefined) => void;
  };
}

export const useAuthorizationStore = create<AuthorizationState>((set) => ({
  user: undefined,
  actions: {
    setUser: (user: User | undefined) => set({ user }),
  },
}));

export const useGetUser = () => {
  return useAuthorizationStore((state) => state.user);
};
