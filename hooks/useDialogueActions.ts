import { request } from "@/lib/request"
import { useChatStore } from "@/stores/chat";
import { useToastStore } from "@/stores/toast";
import { useParams, useRouter } from "next/navigation";
import { useModelStore } from "@/stores/models";
import { getTextContent } from "@/utils/getTextContent";



//对话列表的状态管理hooks
export function useDialogueActions() {

  const { id: activeDialogueID } = useParams();
  const router = useRouter();


  const addToast = useToastStore((state) => state.addToast);
  const setDialogues = useChatStore((state) => state.setDialogues);
  const setIsCreating = useChatStore((state) => state.setIsCreating);
  const setDialogueMessage = useChatStore((state) => state.setDialogueMessage);
  const activeModel = useModelStore((state) => state.activeModel);
  
  //新建对话
  const createDialogue = async () => {
    let dialogueId = ""
    try {
      const { dialogue } = await request("/api/dialogues", {
        method: "POST",
        body: JSON.stringify({
          name: "新对话",
        }),
      });
      setDialogues((pre) => [dialogue, ...pre]);
      setIsCreating(true);
      router.push(`/c/${dialogue._id}`);
      dialogueId = dialogue._id;
    } catch (error: any) {
      addToast({
        message: "新建对话失败：" + error.message,
        type: "error",
      });
    }
    return {
       dialogueId: dialogueId,
       isNew: true,
     };
  };
  //删除对话
  const deleteDialogue = async (id: string) => {
    try {
      await request(`/api/dialogues/${id}`, {
        method: "DELETE",
      });
      setDialogues((pre) => pre.filter((d) => d._id !== id));
      
      //如果删除的是选中的对话，那么直接跳转到根目录
      if (activeDialogueID === id) {
        setDialogueMessage([]);
        router.push("/");
      }
    } catch (error: any) {
      addToast({
        message: "删除对话失败：" + error.message,
        type: "error",
      });
      return;
    }

  };
  //重命名对话
  const renameDialogue = async (id: string, name: string) => {
    try {
      await request(`/api/dialogues/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
        }),
      });
      setDialogues((pre) =>
        pre.map((d) => ({
          ...d,
          name: d._id === id ? name : d.name,
        })),
      );
    } catch (error: any) {
      addToast({
        message: "重命名对话失败：" + error.message,
        type: "error",
      });
      return;
    }
  };
  //初次对话，ai生成对话标题，并更新对话标题
  const updateDialogueTitle = async (id: string, message: string, fullContent: string) => {
    console.log("打印传递过来的message",message);
    try {
      const response = await request(`/api/dialogues/title`, {
          method: "POST",
          body: JSON.stringify({
            modelInfo: activeModel,
            message: [
              {
                role: "user",
                content: message,
              },
              {
                role: "assistant",
                content: fullContent,
              },
            ],
          }),
        });
      renameDialogue(id, response.title);
      console.log("标题",response);
    } catch (error: any) {
      addToast({
        message: "更新对话标题失败：" + error.message,
        type: "error",
      });
      return;
    }
  };

  return {
    createDialogue,
    deleteDialogue,
    renameDialogue,
    updateDialogueTitle,
  }
}
