"use client";

import MobileSidebar from "@/components/sidebar/MobileSidebar";
import DesktopSidebar from "@/components/sidebar/DesktopSidebar";
import ChatInput from "@/components/chat/ChatInput";
import Header from "@/components/header/Header";
import ScrollButton from "@/components/chat/ScrollButton";
import { useState } from "react";
import { useScroll } from "@/hooks/useScroll";
import { useParams } from "next/navigation";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useModels } from "@/hooks/useModels";
import { useDialogueList } from "@/hooks/useDialogueList";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   //获取信息：
   //  1.获取用户信息
   useUserInfo()
   //  2.获取模型列表
   useModels();
   //  3.对话列表
   useDialogueList();



  // 滚动状态
  const {
    chatContainerRef,
    isScrollToBottom,
    setIsScrollToBottom,
    isScrollToTop,
  } = useScroll();

  // 路由参数
  const { id: activeDialogueID } = useParams();

  // 菜单按钮状态
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)


  return (
    <div className="flex w-screen h-screen">
      {/* 左侧导航栏 */}
      <MobileSidebar isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
      <DesktopSidebar />
      {/* 右侧聊天区域 */}
      <div
        className="scroll-container flex-1 flex flex-col items-center overflow-y-auto mb-6 rounded-md"
        ref={chatContainerRef}
      >
        <div className={`w-full ${activeDialogueID ? "flex-1" : ""}  flex flex-col items-center`}>
          {/* header区域 */}
          <Header isScrollToTop={isScrollToTop}  setIsOpenMenu={setIsOpenMenu} isOpenMenu={isOpenMenu} />

          {children}

          {/* 图标，当用户未将聊天记录区域滚动到最底部时，
              该标识用于展示ai是否正在回复，ai回复后，
              点击该标识可以滚动到最底部，同时隐藏该标识 */}
          <ScrollButton
            isScrollToBottom={isScrollToBottom}
            setIsScrollToBottom={setIsScrollToBottom}
            chatContainerRef={chatContainerRef}
          />
        </div>
        {/* 输入框区域 */}
        <ChatInput />
      </div>
    </div>
  );
}
