import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { modelInfoType } from "@/types/chat";

// 更新ModelState接口，添加activeModel和setActiveModel状态管理
interface ModelState {
  modelList: modelInfoType[];
  activeModel: modelInfoType | null;
  openSetModel: openSetModel;
  setActiveModel: (activeModel: StateUpdater<modelInfoType | null>) => void;
  setModelList: (modelList: StateUpdater<modelInfoType[]>) => void;
  setOpenSetModel: (openSetModel: openSetModel) => void;
}
type StateUpdater<T> = T | ((prev: T) => T);

type openSetModel = "" | "userInfo" | "models";

export const useModelStore = create<ModelState>()(
  devtools((set) => ({
    modelList: [],
    activeModel: null,
    openSetModel: "", // 是否打开设置弹窗,主要这个弹窗要可以从两个地方打开，所以考虑放到store中。
    setModelList: (modelList) =>
      set((state) => ({
        modelList:
          typeof modelList === "function"
            ? modelList(state.modelList)
            : modelList,
      })),
    setActiveModel: (activeModel) => {
      set((state) => ({
        activeModel:
          typeof activeModel === "function"
            ? activeModel(state.activeModel)
            : activeModel,
      }));
    },
    setOpenSetModel: (openSetModel) => {
      set({
        openSetModel: openSetModel,
      });
    },
  })),
);
