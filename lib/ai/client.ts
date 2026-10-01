import "server-only"

import { modelInfoType } from "@/types/chat";

interface Body{
    model: string;
    stream: boolean;
    stream_options?: object;
    enable_thinking: boolean;
    enable_search?: boolean;
    search_options?: object;
    messages: any[];
}

export async function client(body: Body,modelInfo: modelInfoType) {
  return fetch(modelInfo.baseUrl as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${modelInfo.apiKey}`,
    },
    body: JSON.stringify(body),
  });
}
