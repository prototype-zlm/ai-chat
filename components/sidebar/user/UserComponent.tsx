"use client";

import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useToastStore } from "@/stores/toast";
import { useModelStore } from "@/stores/models";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import UserSetDialog from "@/components/userSetDialog/userSetDialog";
import { useUserStore } from "@/stores/user";

interface MenuProps {
  x: number;
  y: number;
}

export default function UserComponent() {
  const router = useRouter();
  //用户信息
  const { isLogin } = useAuth();

  // 显示消息
  const addToast = useToastStore((state) => state.addToast);
  // 用户信息
  const userInfo = useUserStore((state) => state.userInfo);
  //打开模型设置列表弹窗
  const setOpenSetModel = useModelStore((state) => state.setOpenSetModel);

  const menuRef = useRef<HTMLDivElement>(null);

  //对话菜单栏状态
  const [menu, setMenu] = useState<MenuProps | null>(null);

  // 用户设置弹窗状态
  // const [userSetDialog, setUserSetDialog] = useState<boolean>(false);

  //退出登录
  const logout = async () => {
    try {
      setMenu(null);
      await signOut({
        redirect: false,
      });
      // router.replace("/");
      // window.location.reload();
      window.location.href = "/";

      addToast({
        message: "已退出登录",
        type: "success",
      });
    } catch (error: any) {
      addToast({
        message: error.message,
        type: "error",
      });
    }
  };

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

  // 未登录时显示登录按钮
  if (!isLogin) {
    return (
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
    );
  }

  return (
    <>
      {/* 登录成功后，显示用户信息 */}
      {userInfo && (
        <div
          className="w-full flex items-center justify-start gap-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log("点击了");
            const rect = (
              e.currentTarget as HTMLSpanElement
            ).getBoundingClientRect();
            //从菜单按钮的位置计算弹窗的位置
            setMenu({
              x: rect.left,
              y: rect.top + 30,
            });
          }}
        >
          <img
            src={userInfo.avatar}
            alt="user"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <div className="text-sm font-medium text-gray-900">
            {userInfo.name}
          </div>
        </div>
      )}

      {/* 对话菜单栏弹窗 */}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            className="z-10 fixed w-44 p-3 bg-white rounded-md shadow-md"
            style={{
              left: menu.x,
              top: menu.y - 130,
            }}
          >
            <ul className="flex flex-col gap-3">
              <li
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
                onClick={() => {
                  setMenu(null);
                  setOpenSetModel("userInfo");
                }}
              >
                设置
              </li>
              <li
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md"
                onClick={() => {
                  logout();
                }}
              >
                退出登录
              </li>
            </ul>
          </div>,
          document.body,
        )}

      {/* 用户设置弹窗，这个弹窗要不要放到layout里面呢？ */}
      <UserSetDialog
        onClose={() => {
          setOpenSetModel("");
        }}
      />
    </>
  );
}
