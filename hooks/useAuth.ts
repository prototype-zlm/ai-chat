"use client";

import { useSession } from "next-auth/react";


export default function useAuth() {

  const { data: session, status,update } = useSession();

  
  return {
    session,
    user: session?.user,
    isLogin: status === "authenticated",
    isLoading: status === "loading",
    update
  }
}