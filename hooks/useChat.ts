import { useRef } from "react";
import { nanoid } from "nanoid";
import { parseSSEChunk, filterMessagesForAPI } from "@/utils/sse";
import { chatConstants } from "@/constants/chat";
import { request } from "@/lib/request";
import { useToastStore } from "@/stores/toast";
import { useChatStore } from "@/stores/chat";
import { useModelStore } from "@/stores/models";
import { useParams } from "next/navigation";
import { useDialogueActions } from "@/hooks/useDialogueActions";
import { UsageType, ContentPartType } from "@/types/chat";
import { getTextContent } from "@/utils/getTextContent"

// 消息状态管理hooks
export function useChat() {
  
  //对话id
  const { id: activeDialogueID } = useParams();


  const dialogueMessage = useChatStore((state) => state.dialogueMessage);
  const isLoading = useChatStore((state) => state.isLoading);

  const addToast = useToastStore((state) => state.addToast);
  const setDialogueMessage = useChatStore((state) => state.setDialogueMessage);
  const setIsLoading = useChatStore((state) => state.setIsLoading);
  const setIsCreating = useChatStore((state) => state.setIsCreating);
  // 当前模型
  const activeModel = useModelStore((state) => state.activeModel);


  const { createDialogue, updateDialogueTitle } = useDialogueActions();

  //收集一帧的流式回复
  const thinkingRef = useRef<string>("");
  const contentRef = useRef<string>("");

  // 完整的思考过程
  const fullThinkingRef = useRef<string>("");
  // 完整的回复
  const fullContentRef = useRef<string>("");
  // 模型调用统计
  const usageRef = useRef<UsageType | undefined>(undefined);

  // 定时器id引用
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 发送消息
  const sendMessage = async (message: string | ContentPartType[]) => {
    console.log("打印message",message)

  try {
    
    if(!activeModel) throw new Error("请先添加模型信息");

    let currentDialogueId = activeDialogueID as string;
    let isNewDialogue  = false;
    if (!currentDialogueId) {
      /**
       * 创建新对话，并且换到新对话，
       * 切换前，currentDialogueId为undefined
       * router.push是异步任务，在发送消息的执行过程中，异步任务执行完毕
       * 切换完成，就能拿到新的对话id
       */
      const { dialogueId, isNew } = await createDialogue();
      currentDialogueId = dialogueId;
      isNewDialogue = isNew;
    }

    if (isLoading) {
      addToast({
        type: "info",
        message: "请稍后，正在回复中",
      });
      return;
    }
    setIsLoading(true);

    

    //流程：
    // 点击某个对话，拿到该对话的历史消息currentMessages，
    //构造消息数组historyMessages（包含用户消息），用于发送大模型请求
    //本地展示历史消息+用户消息+loading
    //使用构造的消息数组发送请求，获取流式回复流
    //拿到流式数据，不断更新本地的消息数组，用于展示
    //在流式回复完成后将用户消息和最终的回复和思考过程添加到数据库中

    //当前的对话消息，过滤掉loading状态和思考过程状态
    const currentMessages = filterMessagesForAPI(dialogueMessage);
    // 构造消息数组（包含用户消息）
    const historyMessages = [
      ...currentMessages,
      { role: "user", content: message },
    ];


    // 清空之前的思考过程和回复
      fullThinkingRef.current = "";
      fullContentRef.current = "";
      thinkingRef.current = "";
      contentRef.current = "";


      // 发送消息
      setDialogueMessage((pre) => [
        ...pre,
        {
          _id: nanoid(),
          dialogueId: nanoid(),
          createdAt: Date.now(),
          role: "user",
          content: message,
        },
        {
          _id: nanoid(),
          dialogueId: nanoid(),
          createdAt: Date.now(),
          role: "loading",
          content: "",
          thinking: "",
        },
      ]);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: historyMessages,
          modelInfo: activeModel,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error?.message ?? data?.message);
      }
      if (!res.body) {
        throw new Error("没有返回流");
      }

      //获取reader
      const reader = res.body.getReader();
      //创建解码器
      const decoder = new TextDecoder();

      /**
       * 由于每次流式数据返回的间隔绝大部分都大于60hz下的16.6ms的间隔频率，
       * 导致raf并不能在多次流式数据返回后集中更新，实际上流式数据的循环次数和raf的执行次数几乎相差无几。
       * raf并不能显著提升渲染性能，改为定时器
       */
      function scheduleFlush() {
        if (timerIdRef.current !== null) return;
        timerIdRef.current = setTimeout(() => {
          const thinking = thinkingRef.current;
          const content = contentRef.current;
          fullThinkingRef.current += thinking;
          fullContentRef.current += content;
          thinkingRef.current = "";
          contentRef.current = "";
          timerIdRef.current = null;
          setDialogueMessage((pre) => {
            const lastIndex = pre.length - 1;
            if (lastIndex < 0) return pre;
            const next = [...pre];

            next[lastIndex] = {
              ...next[lastIndex],
              role: "assistant",
              thinking: next[lastIndex].thinking + thinking,
              content: next[lastIndex].content + content,
              usage: usageRef.current,
            };

            return next;
          });
        }, chatConstants.aiReplyInterval);
      }

      //循环读取
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        //解码成字符串
        const chunk = decoder.decode(value);

        /**
         * @param usage 模型调用统计
         * 包含token数、输入token数、输出token数
         *  prompt_tokens：输入token数
         *  prompt_tokens_details.cached_tokens：缓存命中的输入token数
         *  completion_tokens：输出token数，包含推理token数
         *  completion_tokens_details.reasoning_tokens：推理token数
         *  total_tokens：输入token数 + 输出token数
         */
        const { thinking, content, usage } = parseSSEChunk(chunk);
        thinkingRef.current += thinking;
        contentRef.current += content;
        usageRef.current = usage;
        scheduleFlush();
      }

      // while 循环结束后,先保存用户消息，再保存ai回复，顺序固定，不然查询时就乱了
      (await request(`/api/dialogues/${currentDialogueId}/message`, {
        method: "POST",
        body: JSON.stringify({
          role: "user",
          content: message,
          thinking: "",
        }),
      }),
        await request(`/api/dialogues/${currentDialogueId}/message`, {
          method: "POST",
          body: JSON.stringify({
            role: "assistant",
            content: fullContentRef.current,
            thinking: fullThinkingRef.current,
            usage: usageRef.current,
          }),
        }));
        

      //证明是新对话
      if (isNewDialogue) {
        await updateDialogueTitle(currentDialogueId, getTextContent(message), fullContentRef.current);
      }


    } catch (error: any) {
      addToast({
        type: "error",
        message: "发送消息失败,错误信息为：" + error.message,
      });
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
      setDialogueMessage((pre) => {
        //at方法获取指定索引的元素，-1表示最后一个元素
        const last = pre.at(-1);
        if (!last) return pre;
        if (last.role === "user") {
          return [
            ...pre,
            {
              _id: nanoid(),
              dialogueId: nanoid(),
              createdAt: Date.now(),
              role: "assistant",
              content: "错误，请稍后重试",
            },
          ];
        }
        return [
          ...pre.slice(0, -1),
          {
            ...last,
            role: "assistant",
            content: "错误，请稍后重试",
          },
        ];
      });
    } finally {
      setIsLoading(false);
      setIsCreating(false);
    }
  };

  return {
    sendMessage,
  };
}
