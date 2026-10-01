import { DialogueMessageType, UsageType } from "@/types/chat";

//sse解析工具
export function parseSSEChunk(chunk: string):{
    thinking:string,
    content:string,
    usage:UsageType | undefined,
} {

  let thinking:string = "";
  let content:string = "";
  let usage:UsageType | undefined = undefined;

   //解析sse数据
  const lines = chunk.split("\n");
  for (const line of lines) {
    if (line.startsWith("data:")) {
      const jsonStr = line.slice(5).trim();
      if (jsonStr === "[DONE]") break; // 流结束

      try {
        const data = JSON.parse(jsonStr);

        const reasoning = data.choices?.[0]?.delta?.reasoning_content;

        const contentChunk = data.choices?.[0]?.delta?.content;
        if (reasoning || contentChunk) {
          thinking += reasoning ?? "";
          content += contentChunk ?? "";
        }
        if (data.usage) {
          usage = data.usage;
        }
      } catch (error: any) {
        // 抛出错误，让外层catch捕获
        throw new Error("解析sse数据失败,错误信息为：" + error.message);
      }
    }
  }
  return { thinking, content, usage };
}


/**
 * 接受一个对话消息数组
 * 过滤消息，移除 loading 状态和 thinking 字段
 */
export function filterMessagesForAPI(messages:DialogueMessageType[]){
  return messages
        .filter((m) => m.role !== "loading")
        .map(({ thinking, ...rest }) => rest) || [];
}
