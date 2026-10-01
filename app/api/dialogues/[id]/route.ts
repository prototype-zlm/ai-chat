import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/models/Dialogue";
import Message from "@/models/Message";
import { authOptions } from "@/lib/auth";



//获取指定对话,不包含消息
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
  return NextResponse.json({ dialogue });
}

//更新对话名称
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  const { name } = await req.json();
  await dbConnect();
  const dialogue = await Dialogue.findOneAndUpdate({_id: id, userId: session.user.id}, { name }, { new: true });
  if (!dialogue) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 });
  }
  return NextResponse.json({ dialogue });
}

//删除指定对话和消息
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  await dbConnect();
  const dialogue = await Dialogue.findOneAndDelete({_id: id, userId: session.user.id });
  if (!dialogue) {
    return NextResponse.json({ error: "对话不存在" }, { status: 404 });
  }
  await Message.deleteMany({ dialogueId: id });
  return NextResponse.json({ dialogue });
}