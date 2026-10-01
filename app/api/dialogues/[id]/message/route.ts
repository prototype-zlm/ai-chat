import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/models/Dialogue";
import Message from "@/models/Message";
import { authOptions } from "@/lib/auth";


//获取指定对话的所有消息
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  await dbConnect();
  const dialogue = await Dialogue.findOne({_id: id, userId: session.user.id});
  if (!dialogue) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 });
  }
  const messages = await Message.find({ dialogueId: id }).sort({ createdAt: 1 });
  return NextResponse.json({ messages });
}



//添加消息
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  const { role, content, thinking, usage } = await req.json();
  await dbConnect();
  const dialogue = await Dialogue.findOne({_id: id, userId: session.user.id});
  if (!dialogue) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 });
  }
  // 标记对话有消息
  dialogue.isMessage = true;
  await dialogue.save();
  
  const message = await Message.create({
    dialogueId: id,
    role,
    content,
    thinking,
    usage,
  });
  return NextResponse.json({ message });
}