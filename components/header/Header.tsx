"use client";

import SidebarToggleSvgIcon from "@/components/ui/SidebarToggleSvgIcon";
import MoreOptionsSvgIcon from "@/components/ui/MoreOptionsSvgIcon";
import ModelToggleSvgIcon from "@/components/ui/ModelToggleSvgIcon";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useModelStore } from "@/stores/models";
import { switchModel } from "@/services/models";

interface HeaderProps {
  isScrollToTop: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
  isOpenMenu: boolean;
}

export default function Header({
  isScrollToTop,
  setIsOpenMenu,
  isOpenMenu,
}: HeaderProps) {
  const router = useRouter();
  const { isLogin } = useAuth();

  // 模型列表
  const modelList = useModelStore((state) => state.modelList);
  // 当前模型
  const activeModel = useModelStore((state) => state.activeModel);
  //更新当前模型
  const setActiveModel = useModelStore((state) => state.setActiveModel);
  //打开模型设置列表弹窗
  const setOpenSetModel = useModelStore((state) => state.setOpenSetModel);

  // 模型切换下拉框状态
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);

  //工具按钮状态
  const [isOpenTool, setIsOpenTool] = useState<boolean>(false);

  return (
    <div
      className={`w-full bg-white sticky top-0 border-gray-300 lg:border-b-0 ${isScrollToTop ? "border-b" : "border-b-0"}`}
    >
      <div className="h-12 px-2 flex justify-between items-center">
        {/* 左侧：1.侧边栏按钮（移动端显示，创建对话等等，代替PC端的侧边栏）2.模型切换下拉框 */}
        <div className="flex items-center gap-4">
          <div
            className="md:hidden"
            onClick={() => {
              setIsOpenMenu(!isOpenMenu);
            }}
          >
            <SidebarToggleSvgIcon />
          </div>
          {/* 模型切换下拉框 */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setIsOpenModel(!isOpenModel);
              }}
            >
              {/* 当前模型名称 */}
              <div className="text-sm font-medium text-gray-900">
                {activeModel?.model}
              </div>
              <ModelToggleSvgIcon
                className={
                  isOpenModel
                    ? "rotate-180 duration-300 transition-transform"
                    : "rotate-0 duration-300 transition-transform"
                }
              />
            </div>
            <div
              className={`w-50 bg-gray-400/50 p-2 mt-2 rounded-md absolute top-full left-0 ${isOpenModel ? "block" : "hidden"}`}
            >
              <ul className="w-full h-full flex flex-col items-center gap-2">
                {modelList.map((model) => (
                  <li
                    key={model._id}
                    className="ellipsis w-full p-2 rounded-md cursor-pointer hover:bg-gray-200"
                    onClick={async () => {
                      await switchModel(model._id);
                      setActiveModel(model);
                      setIsOpenModel(false);
                    }}
                  >
                    {model.model}
                  </li>
                ))}
                <li
                  className="ellipsis w-full p-2 rounded-md cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setOpenSetModel("models");
                  }}
                >
                  添加模型
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* 右侧：1.更多操作按钮，PC、移动端都显示，分享聊天、删除对话等等 */}
        {isLogin && (
          <div>
            <div onClick={() => setIsOpenTool(!isOpenTool)}>
              <MoreOptionsSvgIcon />
            </div>
          </div>
        )}
        {/* 当未登录时，显示登录按钮 */}
        {!isLogin && (
          <div className="flex items-center gap-4">
            {/* 登录按钮 */}
            <div
              className="w-full flex items-center justify-start gap-2 cursor-pointer"
              onClick={() => {
                router.push("/login");
              }}
            >
              <div className="w-full text-center border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-900">
                登录
              </div>
            </div>
            {/* 注册按钮 */}
            <div
              className="w-full flex items-center justify-start gap-2 cursor-pointer"
              onClick={() => {
                router.push("/register");
              }}
            >
              <div className="w-full text-center border border-gray-300 rounded-full px-4 py-2 text-sm font-medium text-gray-900">
                注册
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
