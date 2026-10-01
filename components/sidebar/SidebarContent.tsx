"use client";

import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chat";
import SidebarToggleSvgIcon from "@/components/ui/SidebarToggleSvgIcon";
import UserComponent from "@/components/sidebar/user/UserComponent";
import DialogueList from "@/components/sidebar/dialoguelist/DialogueList";



interface SidebarProps {
  isOpenMenu?: boolean;
  closeSidebar?: () => void;
}


export default function Sidebar({ isOpenMenu, closeSidebar }: SidebarProps) {


  // 路由
  const router = useRouter();

  const setDialogueMessage = useChatStore((state) => state.setDialogueMessage);
  
  //对话菜单栏弹窗
  return (
    <div
      className="w-64 h-lvh border border-gray-300 rounded-md bg-white"
      onClick={(e) => {
        if (isOpenMenu) {
          e.stopPropagation();
        }
      }}
    >
      {/* 仅移动端显示 */}
      <div
        className={`p-4 flex justify-between items-center ${isOpenMenu ? "block" : "hidden"}`}
      >
        <div onClick={() => closeSidebar?.()}>
          <SidebarToggleSvgIcon />
        </div>
        <div onClick={() => closeSidebar?.()}>X</div>
      </div>
      <div className="h-full flex flex-col px-2">
        {/* 标题 */}
        <div className="p-4 text-lg sm:text-xl text-center font-bold text-gray-900">
          AI Chat
        </div>
        <div className="flex-1 flex gap-3 flex-col w-full min-h-0 py-4">
          {/* 新建对话按钮 */}
            <button
              className="w-full text-left cursor-pointer hover:bg-gray-300 text-black px-4 py-3 rounded-md"
              onClick={() => {
                router.push("/");
                setDialogueMessage([]);
              }}
            >
              新建对话
            </button>

          {/* 此处后期应该还会有其他功能，比如自定义key、mcp、skills等 */}
            <button
              className="w-full text-left cursor-pointer hover:bg-gray-300 text-black px-4 py-3 rounded-md">
              测试功能1
            </button>
            <button
              className="w-full text-left cursor-pointer hover:bg-gray-300 text-black px-4 py-3 rounded-md">
              测试功能2
            </button>
            <button
              className="w-full text-left cursor-pointer hover:bg-gray-300 text-black px-4 py-3 rounded-md">
              测试功能3
            </button>

          {/* 对话列表 */}
          <DialogueList />

          {/* 昵称+头像 */}
          <UserComponent />
        </div>
      </div>
    </div>
  );
}
