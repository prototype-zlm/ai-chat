import { chat } from "@/lib/ai/chat";
import { NextResponse } from "next/server";
const QWEN_SYSTEM_PROMPT_ROLE_RULE = process.env.QWEN_SYSTEM_PROMPT_ROLE_RULE;
const QWEN_SYSTEM_PROMPT_THINKING_RULE =
  process.env.QWEN_SYSTEM_PROMPT_THINKING_RULE;

export async function POST(request: Request) {
  try {
    const { message, modelInfo } = await request.json();
    console.log("消息：", message);

    //追加系统提示词
    // 身份提示词
    message.unshift({
      role: "system",
      content: QWEN_SYSTEM_PROMPT_ROLE_RULE,
    });
    // 推理规则提示词
    message.unshift({
      role: "system",
      content: QWEN_SYSTEM_PROMPT_THINKING_RULE,
    });

    const response = await chat(message, modelInfo);
    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, {
        status: response.status,
      });
    }
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "服务器错误",
    }, {
      status: 500,
    });
  }
}
