import { request } from "@/lib/request";
import { userInfoType } from "@/types/chat";

interface UpdateUserInfo extends userInfoType {
    password?: string;
}

export async function updateUserInfo(data: UpdateUserInfo) {
  const updateData: Partial<UpdateUserInfo> = {};

  if (data.name) updateData.name = data.name;
  if (data.avatar) updateData.avatar = data.avatar.split("?")[0];
  if (data.password) updateData.password = data.password;

  return request("/api/userInfo", {
    method: "POST",
    body: JSON.stringify(updateData),
  });
}