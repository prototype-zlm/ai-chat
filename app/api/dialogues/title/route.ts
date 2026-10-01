import { getDialogueTitle } from "@/lib/ai/title";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    const { message, modelInfo } = await request.json();

    let messageContent = [
      {
        role: "system",
        content: `
      你是一个聊天软件的标题生成器。

      任务：
      根据用户与 AI 的聊天内容，生成一个用于聊天列表展示的标题。

      要求：
      1. 标题长度不超过 8 个汉字。
      2. 使用第三人称、中立视角描述聊天主题。
      3. 标题应概括聊天内容，而不是描述对话双方。
      4. 不要使用"我"、"你"、"我们"、"你的"等第一、第二人称。
      5. 不要输出"生成失败"、"无法生成"、"未知"等内容。
      6. 不要解释，不要思考，不要添加引号。
      7. 只输出标题文本。
      `,
      },
      ...message,
    ];
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }
    const response = await getDialogueTitle(messageContent, modelInfo);
    if (!response.ok) {
      return NextResponse.json({ error: "对话标题生成失败" }, { status: 500 });
    }
    const data = await response.json();

    return NextResponse.json({
      title: data.choices[0].message.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "对话标题生成失败" },
      { status: 500 },
    );
  }
}
