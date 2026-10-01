import type { DialogueType } from "@/types/chat";
import React, { useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDialogueActions } from "@/hooks/useDialogueActions";

interface MenuProps {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface DialogueItemProps {
  dialogue: DialogueType;
  renameId: string;
  renameName: string;
  setRenameId: (id: string) => void;
  setRenameName: (name: string) => void;
  setMenu: (menu: MenuProps | null) => void;
}

// 对话列表项
const DialogueItem = React.memo(
  ({
    dialogue,
    renameId,
    renameName,
    setRenameId,
    setRenameName,
    setMenu,
  }: DialogueItemProps) => {
    // 当前页面路径
    const pathname = usePathname();
    // 路由实例
    const router = useRouter();

    // 对话列表状态
    const { renameDialogue } = useDialogueActions();

    const renameInputRef = useRef<HTMLInputElement>(null);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    //点击重命名，更新renameName之后，需要将输入框聚焦起来
    useEffect(() => {
      if (renameId === dialogue._id) {
        renameInputRef.current?.focus();
      }
    }, [renameId, dialogue._id]);

    let isActive = pathname === `/c/${dialogue._id}`;
    return (
      <div className={`dialogue-item ${isActive ? "active" : ""}`}>
        <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
          {renameId !== dialogue._id && (
            <div
              className="text-sm"
              onClick={() => {
                if (clickTimer.current) {
                  clearTimeout(clickTimer.current);
                }

                clickTimer.current = setTimeout(() => {
                  router.push(`/c/${dialogue._id}`);
                }, 250);
              }}
              onDoubleClick={() => {
                if (clickTimer.current) {
                  clearTimeout(clickTimer.current);
                  clickTimer.current = null;
                }

                setRenameId(dialogue._id);
                setRenameName(dialogue.name);
              }}
            >
              {dialogue.name}
            </div>
          )}
          {renameId === dialogue._id && (
            <input
              className="w-full border-0 rounded-md outline-none focus:outline-none"
              ref={renameInputRef}
              type="text"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              //失去焦点时，重命名对话
              onBlur={() => {
                renameDialogue(dialogue._id, renameName!);
                setRenameName("");
                setRenameId("");
              }}
            />
          )}
        </div>
        {/* 对话菜单栏 */}
        {/* 当鼠标悬停在对话上时，并且没有重命名对话，才显示对话栏 */}
        <div className="menuPopup">
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              //获取菜单按钮的位置
              const rect = e.currentTarget.getBoundingClientRect();
              //从菜单按钮的位置计算弹窗的位置
              setMenu({
                id: dialogue._id,
                name: dialogue.name,
                x: rect.left,
                y: rect.top + 30,
              });
            }}
          >
            ...
          </button>
        </div>
      </div>
    );
  },
);
export default DialogueItem;
