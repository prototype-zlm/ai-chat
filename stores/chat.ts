import { create } from "zustand";
import type { DialogueType, DialogueMessageType } from "@/types/chat";
import { devtools } from "zustand/middleware";

interface ChatState {
  dialogues: DialogueType[];
  dialogueMessage: DialogueMessageType[];
  isLoading: boolean;
  ready: boolean;
  isCreating: boolean;
  enableThinking: boolean; //思考模式开关
  enableSearch: boolean; //联网搜索开关
  setDialogues: (updater: StateUpdater<DialogueType[]>) => void;
  setDialogueMessage: (updater: StateUpdater<DialogueMessageType[]>) => void;
  setIsLoading: (updater: boolean) => void;
  setReady: (updater: boolean) => void;
  setIsCreating: (updater: boolean) => void;
  setEnableThinking: (updater: boolean) => void;
  setEnableSearch: (updater: boolean) => void;
}

type StateUpdater<T> = T | ((prev: T) => T);

export const useChatStore = create<ChatState>()(
  devtools((set) => ({
    dialogues: [],
    dialogueMessage: [],
    isLoading: false, //ai是否正在回复中
    ready: false, //页面是否准备好显示，初始在未滚动到底部之前，先隐藏页面，防止页面闪烁
    isCreating: false, //是否正在创建对话
    enableThinking: false, //思考模式开关，默认关闭
    enableSearch: false, //联网搜索开关，默认关闭
    setDialogues: (updater: StateUpdater<DialogueType[]>) =>
      set((state) => ({
        dialogues:
          typeof updater === "function" ? updater(state.dialogues) : updater,
      })),
    setDialogueMessage: (updater) =>
      set((state) => ({
        dialogueMessage:
          typeof updater === "function"
            ? updater(state.dialogueMessage)
            : updater,
      })),
    setIsLoading: (updater: boolean) => set({ isLoading: updater }),
    setReady: (updater: boolean) => set({ ready: updater }),
    setIsCreating: (updater: boolean) => set({ isCreating: updater }),
    setEnableThinking: (updater: boolean) => set({ enableThinking: updater }),
    setEnableSearch: (updater: boolean) => set({ enableSearch: updater }),
    //后面可以添加一个重置状态的方法，用于重置所有状态
  })),
);
