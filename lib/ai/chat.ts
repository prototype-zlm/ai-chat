import "server-only"

import { client } from "./client";
import { ChatMessageType, modelInfoType } from "@/types/chat";

export function chat(message: ChatMessageType[], modelInfo: modelInfoType) {
  console.log("本次使用的模型",modelInfo);
  return client({
    model: modelInfo.model,
    stream: true, // 开启流式返回
    stream_options: {
      include_usage : true,  //是否包含使用信息
    },
    enable_thinking: true, //是否开启思考模式
    enable_search: true,  //是否开启联网搜索
    search_options: {
      forced_search: true,  //是否强制联网搜索
    },
    messages: message,
  }, modelInfo);
}
