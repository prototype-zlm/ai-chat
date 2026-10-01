"use client";

import { useState } from "react";

import { useChatStore } from "@/stores/chat";
import DialogueItem from "@/components/sidebar/dialoguelist/dialogueitem/DialogueItem";
import DialogueMenu from "@/components/sidebar/dialoguelist/dialoguemenu/DialogueMenu";

interface MenuProps {
  id: string;
  name: string;
  x: number;
  y: number;
}

export default function DialogueList() {

  // 对话列表状态
  const dialogues = useChatStore((state) => state.dialogues);

  //对话菜单栏状态
  const [menu, setMenu] = useState<MenuProps | null>(null);
  //当前重命名的对话id
  const [renameId, setRenameId] = useState("");
  //重命名对话输入框状态
  const [renameName, setRenameName] = useState("");


  return (
    <>
      <div className="dialogue-list flex-1 w-full min-h-0 flex flex-col items-center px-2 py-4 overflow-y-auto border-y border-gray-200">
        {dialogues.map((dialogue) => (
          <DialogueItem
            dialogue={dialogue}
            key={dialogue._id}
            renameId={renameId}
            renameName={renameName}
            setRenameId={setRenameId}
            setRenameName={setRenameName}
            setMenu={setMenu}
          />
        ))}
      </div>

      {/* 对话菜单栏弹窗 */}
      {menu && (
        <DialogueMenu
          menu={menu}
          setMenu={setMenu}
          setRenameId={setRenameId}
          setRenameName={setRenameName}
        />
      )}
    </>
  );
}
