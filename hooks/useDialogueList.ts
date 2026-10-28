import { useEffect } from "react";
import { useChatStore } from "@/stores/chat";
import useAuth from "./useAuth";
import { request } from "@/lib/request";
import { useToastStore } from "@/stores/toast";


export function useDialogueList() {

  const { isLogin } = useAuth()
  const addToast = useToastStore((state) => state.addToast);

  const setDialogues = useChatStore((state) => state.setDialogues);

  useEffect(() => {
    if(!isLogin) return
    // 从服务器读取对话列表
    async function fetchDialogues() {
      try {
        const { dialogues } = await request("/api/dialogues", {
          method: "GET",
        });

        setDialogues(dialogues || []);
      } catch (error: any) {
        addToast({
          message: "获取对话列表失败：" + error.message,
          type: "error",
        })
      }
    }
    fetchDialogues();
  }, [isLogin, setDialogues]);
}
