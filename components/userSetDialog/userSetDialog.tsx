// 用户的设置弹窗
import Dialog from "@/components/ui/Dialog";
import UserInfo from "./UserInfo";
import Models from "./Models";
import { useState, useEffect } from "react";
import { useModelStore } from "@/stores/models";

export default function UserSetDialog({ onClose }: { onClose: () => void }) {
  const openSetModel = useModelStore((state) => state.openSetModel);

  // 活动的tab
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    setActiveTab(openSetModel);
  }, [openSetModel]);

  // 右边内容展示
  const renderContent = () => {
    if (activeTab === "userInfo") {
      return <UserInfo />;
    }
    if (activeTab === "models") {
      return <Models />;
    }
    return null;
  };

  return (
    <Dialog
      title="用户设置"
      width={600}
      onClose={onClose}
      isOpen={!!openSetModel}
    >
      <div className="flex h-full min-h-0">
        {/* 左边菜单栏 */}
        <div className="w-1/4 h-full border-r border-gray-200">
          <ul
            className="w-full p-4 flex flex-col items-center gap-4"
            onClick={(e) => {
              const target = e.target as HTMLLIElement;
              const id = target.dataset.id;
              console.log("点击的tab:", id);
              if (id) {
                setActiveTab(id);
              }
            }}
          >
            <li
              className={`w-full p-2 rounded-md cursor-pointer hover:bg-gray-300 ${activeTab === "userInfo" ? "bg-gray-300" : ""}`}
              data-id="userInfo"
            >
              用户信息
            </li>
            <li
              className={`w-full p-2 rounded-md cursor-pointer hover:bg-gray-300 ${activeTab === "models" ? "bg-gray-300" : ""}`}
              data-id="models"
            >
              模型
            </li>
          </ul>
        </div>
        {/* 右边内容展示 */}
        <div className="w-3/4 h-full overflow-auto min-h-0 p-4">
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );
}
