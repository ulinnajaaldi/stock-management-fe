import Cookies from "js-cookie";
import { create } from "zustand";

import type { IGetProfile } from "@/domains/User";

import { ACCESS_TOKEN } from "@/constants/config";

interface IAuthStore {
  data: IGetProfile | null;
  setData: (data: IGetProfile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  data: null,
  setData: (data: IGetProfile | null) => set({ data }),
  logout: () => {
    Cookies.remove(ACCESS_TOKEN);
    set({ data: null });
    window.location.href = "/";
  },
}));
