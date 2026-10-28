import { chat } from "@/lib/ai/chat";
import { NextResponse } from "next/server";
const MODEL_SYSTEM_PROMPT_ROLE_RULE = process.env.MODEL_SYSTEM_PROMPT_ROLE_RULE;
const MODEL_SYSTEM_PROMPT_THINKING_RULE =
  process.env.MODEL_SYSTEM_PROMPT_THINKING_RULE;

export async function POST(request: Request) {
  try {
    const { message, modelInfo, enableThinking, enableSearch } = await request.json();
    console.log("消息：", message);

    //追加系统提示词
    // 身份提示词
    message.unshift({
      role: "system",
      content: MODEL_SYSTEM_PROMPT_ROLE_RULE,
    });
    // 推理规则提示词
    message.unshift({
      role: "system",
      content: MODEL_SYSTEM_PROMPT_THINKING_RULE,
    });

    const response = await chat(message, modelInfo, { enableThinking, enableSearch });
    if (!response.ok) {
      //上游响应体不一定是JSON，解析失败时兜底
      let data: { error?: { message?: string } | string };
      try {
        data = await response.json();
      } catch {
        return NextResponse.json({
          error: { message: `上游接口请求失败(${response.status})` },
        }, {
          status: 500,
        });
      }

      //提取上游错误信息（兼容 error 为对象或字符串两种格式）
      const upstreamError = data?.error;
      const upstreamMessage: string =
        typeof upstreamError === "string" ? upstreamError : upstreamError?.message ?? "";

      //开关开启但模型不支持对应能力时，给出明确的提示
      if (enableSearch && /search/i.test(upstreamMessage)) {
        return NextResponse.json({
          error: { message: "该模型不支持联网搜索，请关闭联网开关后重试" },
        }, {
          status: 400,
        });
      }
      if (enableThinking && /think|reasoning/i.test(upstreamMessage)) {
        return NextResponse.json({
          error: { message: "该模型不支持思考模式，请关闭思考开关后重试" },
        }, {
          status: 400,
        });
      }

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
      error: { message: error.message || "服务器错误" },
    }, {
      status: 500,
    });
  }
}
