import { useEffect } from "react";
import { request } from "@/lib/request";
import { useUserStore } from "@/stores/user";
import useAuth from "./useAuth";
import { useToastStore } from "@/stores/toast";

export function useUserInfo() {
  const { isLogin } = useAuth();
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (!isLogin) return;
    async function getUserInfo() {
      try {
        const data = await request("/api/userInfo", { method: "GET" });
        console.log(data);
        setUserInfo(data.user);
      } catch (error: any) {
        addToast({
          message: "获取用户信息失败：" + error.message,
          type: "error",
        })
      }
    }
    getUserInfo();
  }, [isLogin,setUserInfo]);
}
