import { useEffect } from "react";
import { useChatStore } from "@/stores/chat";
import { useParams } from "next/navigation";
import { request } from "@/lib/request";
import useAuth from "./useAuth";



export function useDialogueMessages() {

  const { isLogin } = useAuth()

  const setDialogueMessage = useChatStore((state) => state.setDialogueMessage);
  const isCreating = useChatStore((state) => state.isCreating);
  const { id: activeDialogueID } = useParams();


  useEffect(() => {
    /**
     * 需要用isCreating 来判断一下，因为有可能是在新的对话页面，
     * 用户发送消息--->创建新对话--->切换到新对话--->用新的对话id和用户发送到消息去请求大模型。
     * 如果没有isCreating 的话，就会在切换新对话时获取到空内容，从而覆盖掉另一边去请求大模型拿到的消息。
     */
    if(!isLogin) return
    
    if(isCreating){
      console.log("正在创建新对话，不获取历史消息，防止覆盖新对话中的新消息")
      return;
    }
    async function fetchDialogueMessage() {
      const { messages } = await request(
        `/api/dialogues/${activeDialogueID}/message`,
        {
          method: "GET",
        },
      );
      setDialogueMessage(messages);
    }
    fetchDialogueMessage();
  }, [isLogin, isCreating, activeDialogueID, setDialogueMessage]);
}
