import { request } from "@/lib/request";
import { AddCustomModelRequest } from "@/types/chat";


//添加自定义模型
export async function addCustomModel(model: AddCustomModelRequest) {
  const data = await request("/api/models", {
    method: "POST",
    body: JSON.stringify(model),
  });
  return data;
}
//编辑自定义模型
export async function editCustomModel(model: AddCustomModelRequest) {
  const data = await request("/api/models", {
    method: "PUT",
    body: JSON.stringify(model),
  });
  return data;
}
//删除自定义模型
export async function deleteCustomModel(modelId: string) {
  const data = await request("/api/models", {
    method: "DELETE",
    body: JSON.stringify({ modelId }),
  });
  return data;
}
//切换模型
export async function switchModel(modelId: string) {
  const data = await request("/api/models", {
    method: "PATCH",
    body: JSON.stringify({ modelId }),
  });
  return data;
}