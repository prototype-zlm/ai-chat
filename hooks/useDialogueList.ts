import { useEffect } from "react";
import { useChatStore } from "@/stores/chat";
import useAuth from "./useAuth";
import { request } from "@/lib/request";


export function useDialogueList() {

  const { isLogin } = useAuth()

  const setDialogues = useChatStore((state) => state.setDialogues);

  useEffect(() => {
    if(!isLogin) return
    // 从服务器读取对话列表
    async function fetchDialogues() {
      const { dialogues } = await request("/api/dialogues", {
        method: "GET",
      });

      setDialogues(dialogues || []);
    }
    fetchDialogues();
  }, [isLogin, setDialogues]);
}
