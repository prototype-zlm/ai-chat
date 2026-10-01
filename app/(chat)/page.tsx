"use client";

import useAuth from "@/hooks/useAuth";
import {useUserStore} from "@/stores/user";


export default function Home() {
  //用户信息
  const { isLogin } = useAuth();
  const userInfo = useUserStore((state) => state.userInfo);
  
  return (
    <>
      {isLogin && (
        <div className="text-2xl font-bold text-gray-900 mt-80 mb-4"> 我能帮什么忙吗，{userInfo?.name}?</div>
      )}
      {!isLogin && (
        <div className="text-2xl font-bold text-gray-900 mt-80 mb-4">欢迎来到AI Chat，请先登录</div>
      )}
    </>
  );
}
