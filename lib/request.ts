import { getSession } from "next-auth/react"

export async function request(url: string, options: RequestInit) {
  const session = await getSession();
  if (!session) {
    window.location.href = "/login";
    throw new Error("未登录");
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    let message = `请求失败(${res.status})`;
    try {
      const data = await res.json();
      message = data.error || data.message || message;
    } catch { }
    throw new Error(message);
  }
  return res.json();
}
