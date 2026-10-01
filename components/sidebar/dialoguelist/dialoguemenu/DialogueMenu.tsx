import { createPortal } from "react-dom";
import { useDialogueActions } from "@/hooks/useDialogueActions";
import { useRef, useEffect } from "react";

interface MenuProps {
  id: string;
  name: string;
  x: number;
  y: number;
}
interface DialogueMenuProps {
  menu: MenuProps | null;
  setMenu: (menu: MenuProps | null) => void;
  setRenameId: (id: string) => void;
  setRenameName: (name: string) => void;
}

//对话菜单栏弹窗
export default function DialogueMenu({
  menu,
  setMenu,
  setRenameId,
  setRenameName,
}: DialogueMenuProps) {
  // 对话列表状态
  const { deleteDialogue } = useDialogueActions();

  const menuRef = useRef<HTMLDivElement | null>(null);

  // 点击其他地方关闭弹窗
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      //首先判断弹窗是否存在其次判断点击的是不是弹窗内部
      //只有满足弹窗存在，并且点击的不是弹窗内部，才关闭弹窗
      if (menuRef.current && !menuRef.current?.contains(e.target as Node)) {
        setMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  if (!menu) {
    return null;
  }
  return createPortal(
    <div
      ref={menuRef}
      className="fixed w-44 p-3 bg-white rounded-md shadow-md"
      style={{
        left: menu.x,
        top: menu.y,
      }}
    >
      <ul className="flex flex-col gap-3">
        <li
          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
          onClick={() => {
            deleteDialogue(menu.id);
            setMenu(null);
          }}
        >
          删除
        </li>
        <li
          className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
          onClick={() => {
            setRenameId(menu.id);
            setRenameName(menu.name);
            setMenu(null);
          }}
        >
          重命名
        </li>
      </ul>
    </div>,
    document.body,
  );
}
