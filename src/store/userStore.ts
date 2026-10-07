import { create } from "zustand";

interface UserStore {
  isAdmin: boolean;
  isAdminLoaded: boolean;
  setIsAdmin: (value: boolean) => void;
  setIsAdminLoaded: (value: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isAdmin: false,
  isAdminLoaded: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
  setIsAdminLoaded: (value) => set({ isAdminLoaded: value }),
}));
