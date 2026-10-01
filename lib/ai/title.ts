import "server-only"

import { client } from "./client";
import { modelInfoType,ChatMessageType } from "@/types/chat";


export function getDialogueTitle(message: ChatMessageType[],modelInfo: modelInfoType) {
  return client({
    model: modelInfo.model,
    stream: false, 
    enable_thinking: false, 
    messages: message,
  },modelInfo);
}