import "server-only"

import { client, type Body } from "./client";
import { ChatMessageType, modelInfoType } from "@/types/chat";

//聊天请求的可选开关配置
interface ChatOptions {
  enableThinking?: boolean; //是否开启思考模式
  enableSearch?: boolean; //是否开启联网搜索
}

export function chat(message: ChatMessageType[], modelInfo: modelInfoType, options?: ChatOptions) {
  console.log("本次使用的模型",modelInfo);
  const body: Body = {
    model: modelInfo.model,
    stream: true, // 开启流式返回
    stream_options: {
      include_usage : true,  //是否包含使用信息
    },
    messages: message,
  };

  //思考模式和联网搜索参数仅在对应开关开启时才携带：
  //部分模型（如qwen3-omni系列）不支持这些参数，默认携带会导致接口报错
  if (options?.enableThinking) {
    body.enable_thinking = true; //开启思考模式
  }
  if (options?.enableSearch) {
    body.enable_search = true; //开启联网搜索
    body.search_options = {
      forced_search: true,  //是否强制联网搜索
    };
  }

  return client(body, modelInfo);
}
