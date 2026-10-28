import { useEffect } from "react";
import { useModelStore } from "@/stores/models";
import { useUserStore } from "@/stores/user";
import useAuth from "./useAuth";
import { request } from "@/lib/request";
import { useToastStore } from "@/stores/toast";
import { modelInfoType } from "@/types/chat";


export function useModels() {
  const { isLogin } = useAuth();
  const addToast = useToastStore((state) => state.addToast);
  const setModelList = useModelStore((state) => state.setModelList);
  const setActiveModel = useModelStore((state) => state.setActiveModel);
  const userInfo = useUserStore((state) => state.userInfo);
  useEffect(() => {
    if (!isLogin) return;
    // 从服务器读取模型列表
    async function fetchModelList() {
      try {
        const { models } = await request("/api/models", {
          method: "GET",
        });

        setModelList(models || []);

        const activeModel =
          models.find((model: modelInfoType) => model._id === userInfo?.activeModel) ??
          models[0] ??
          null;

        setActiveModel(activeModel);
      } catch (error: any) {
        addToast({
          message: "获取模型列表失败：" + error.message,
          type: "error",
        })
      }
    }
    fetchModelList();
  }, [isLogin, setModelList, setActiveModel, userInfo]);
}
