// 模型列表的展示、自定义模型的添加
import { addCustomModel, editCustomModel, deleteCustomModel } from "@/services/models";
import { useState } from "react";
import { useModelStore } from "@/stores/models";
import { useToastStore } from "@/stores/toast";
import { AddCustomModelRequest,ModelProtocolType } from "@/types/chat";
import Dialog from "@/components/ui/Dialog";

export default function Models() {
  const modelList = useModelStore((state) => state.modelList);
  const setModelList = useModelStore((state) => state.setModelList);
  const addToast = useToastStore((state) => state.addToast);

  // 弹窗状态
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //编辑状态
  const [isEdit, setIsEdit] = useState<boolean>(false);

  //新增/编辑用户输入的模型信息
  const [model, setModel] = useState<AddCustomModelRequest>({
    modelId: "",
    protocol: "openai",
    baseUrl: "",
    model: "",
    apiKey: "",
  });

  const emptyModel: AddCustomModelRequest = {
    modelId: "",
    protocol: "openai",
    baseUrl: "",
    model: "",
    apiKey: "",
  };

  // 关闭弹窗
  const onClose = () => {
    setIsOpen(false);
    setIsEdit(false);
    setModel(emptyModel);
  };

  // 添加自定义模型
  async function addCustomModelHandle() {
    try {
      const res = await addCustomModel(model);
      setModelList((prev) => [...prev, res.createModel]);
      setIsOpen(false);
    } catch (error: any) {
      addToast({
        message: `添加自定义模型失败：${error.message}`,
        type: "error",
      });
    }
  }

  // 编辑自定义模型
  async function editCustomModelHandle() {
    try {
      const res = await editCustomModel(model);
      setModelList((prev) => {
        return prev.map((item) => {
          if (item._id === model.modelId) {
            return res;
          }
          return item;
        });
      });
      setIsOpen(false);
      setIsEdit(false);
      setModel(emptyModel);
    } catch (error: any) {
      addToast({
        message: `编辑自定义模型失败：${error.message}`,
        type: "error",
      });
    }
  }

  // 删除自定义模型
  async function deleteModel(modelId: string) {
    try {
      await deleteCustomModel(modelId);
      setModelList((prev) => prev.filter((item) => item._id !== modelId));
    } catch (error: any) {
      addToast({
        message: `删除自定义模型失败：${error.message}`,
        type: "error",
      });
    }
  }

  return (
    <>
      {/* 模型列表 */}
      <div className="w-full flex flex-col items-center gap-4">
        <h2>模型列表</h2>
        <div className="overflow-x-auto w-full">
          <table className="models-table min-w-full whitespace-nowrap border-separate border-spacing-x-5 border-spacing-y-5">
            <thead>
              <tr className="text-center">
                <th>模型名称</th>
                <th>协议</th>
                <th>baseUrl</th>
                <th>apiKey</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {modelList.map((model) => (
                <tr key={model._id} className="text-center">
                  <td>{model.model}</td>
                  <td>{model.protocol}</td>
                  <td>{model.baseUrl}</td>
                  <td>{model.apiKey}</td>
                  <td>
                    <button
                      className="cursor-pointer text-gray-500 hover:text-gray-600 pr-1"
                      onClick={() => {
                        setIsEdit(true)
                        setIsOpen(true);
                        setModel({
                          modelId: model._id,
                          protocol: model.protocol,
                          baseUrl: model.baseUrl,
                          model: model.model,
                          apiKey: model.apiKey,
                        })
                      }}
                    >
                      编辑
                    </button>
                    <button
                      className="cursor-pointer text-red-500 hover:text-red-600 pl-1"
                      onClick={() => deleteModel(model._id)}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400"
          onClick={() => setIsOpen(true)}
        >
          添加自定义模型
        </button>
      </div>

      {/* 添加/编辑弹窗 */}
      <Dialog
        title={isEdit ? "编辑自定义模型" : "添加自定义模型"}
        width={400}
        onClose={onClose}
        isOpen={isOpen}
      >
        <div className="w-full flex flex-col items-center gap-4">
          <label className="flex items-center gap-2">
            <span>模型协议：</span>
            <select 
            className="w-53.25 p-2 rounded-md border border-gray-300"
            value={model.protocol}
            onChange={(e) => setModel({ ...model, protocol: e.target.value as ModelProtocolType })}
            >
              <option value="openai">openai</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span>模型名称：</span>
            <input
              type="text"
              placeholder="gpt-3.5-turbo"
              className="input-box"
              value={model.model}
              onChange={(e) => setModel({ ...model, model: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2">
            <span>API密钥：</span>
            <input
              type="password"
              placeholder="sk-1234567890abcdef1234567890abcdef"
              className="input-box"
              value={model.apiKey}
              onChange={(e) => setModel({ ...model, apiKey: e.target.value })}
            />
          </label>
          <label className="flex items-center gap-2">
            <span>baseUrl：</span>
            <input
              type="text"
              placeholder="https://api.openai.com/v1"
              className="input-box"
              value={model.baseUrl}
              onChange={(e) => setModel({ ...model, baseUrl: e.target.value })}
            />
          </label>
          <button
            className="p-2 bg-gray-300 rounded-md cursor-pointer hover:bg-gray-400"
            onClick={() =>
              isEdit ? editCustomModelHandle() : addCustomModelHandle()
            }
          >
            {isEdit ? "编辑" : "添加"}
          </button>
        </div>
      </Dialog>
    </>
  );
}
