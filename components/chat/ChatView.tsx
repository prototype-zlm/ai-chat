"use client";

import MessageList from "@/components/chat/MessageList";
import { useScroll } from "@/hooks/useScroll";
import { useDialogueMessages } from "@/hooks/useDialogueMessages";

export default function ChatView() {
  // 滚动状态
  const { ready} = useScroll();

  // 对话消息
  useDialogueMessages();

  return (
    <>
      {/* 聊天记录区域 */}
      <MessageList ready={ready} />
    </>
  );
}
