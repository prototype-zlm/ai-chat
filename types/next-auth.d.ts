import { DefaultSession } from "next-auth";

// 扩展 next-auth 的 Session 类型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export {};