import { useEffect } from "react";
import { useModelStore } from "@/stores/models";
import { useUserStore } from "@/stores/user";
import useAuth from "./useAuth";
import { request } from "@/lib/request";
import { modelInfoType } from "@/types/chat";



export function useModels() {
  const { isLogin } = useAuth();
  const setModelList = useModelStore((state) => state.setModelList);
  const setActiveModel = useModelStore((state) => state.setActiveModel);
  const userInfo = useUserStore((state) => state.userInfo);
  useEffect(() => {
    if (!isLogin) return;
    // 从服务器读取模型列表
    async function fetchModelList() {
      const { models } = await request("/api/models", {
        method: "GET",
      });

      setModelList(models || []);

      const activeModel =
        models.find((model: modelInfoType) => model._id === userInfo?.activeModel) ??
        models[0] ??
        null;

      setActiveModel(activeModel);
     
    }
    fetchModelList();
  }, [isLogin, setModelList, setActiveModel, userInfo]);
}
