import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { userInfoType } from "@/types/chat";

interface UserState {
  userInfo: userInfoType | null;
  setUserInfo: (userInfo: StateUpdater<userInfoType | null>) => void;
}
type StateUpdater<T> = T | ((prev: T) => T);

export const useUserStore = create<UserState>()(
  devtools((set) => ({
    userInfo: null,
    setUserInfo: (userInfo) =>
      set((state) => ({
        userInfo:
          typeof userInfo === "function" ? userInfo(state.userInfo) : userInfo,
      })),
  })),
);
