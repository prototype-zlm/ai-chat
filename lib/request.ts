import { getSession } from "next-auth/react"

export async function request(url: string, options: RequestInit) {
  const session = await getSession();
  if (!session) {
    window.location.href = "/login";
    throw new Error("未登录");
  }

  const res = await fetch(url, options);
  const data = await res.json();
  if(!res.ok){
    throw new Error(data.error || data.message || "请求失败");
  }
  return data;
}
