import { useEffect } from "react";
import { request } from "@/lib/request";
import { useUserStore } from "@/stores/user";
import useAuth from "./useAuth";

export function useUserInfo() {
  const { isLogin } = useAuth();
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    if (!isLogin) return;
    async function getUserInfo() {
      const data = await request("/api/userInfo", { method: "GET" });
      console.log(data);
      setUserInfo(data.user);
    }
    getUserInfo();
  }, [isLogin]);
}
