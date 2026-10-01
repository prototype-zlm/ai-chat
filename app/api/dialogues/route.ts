import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Dialogue from "@/models/Dialogue";
import { authOptions } from "@/lib/auth";

//获取当前用户的所有对话记录
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  await dbConnect();
  const dialogues = await Dialogue.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ dialogues });
}
//创建新的对话记录
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { name } = await req.json();
  await dbConnect();

  const isExist = await Dialogue.findOne({ userId: session.user.id, isMessage: false });
  if (isExist) {
    return NextResponse.json({ error: "已存在空对话，无需重复创建" }, { status: 400 });
  }

  const dialogue = await Dialogue.create({
    userId: session.user.id,
    name,
  });
  return NextResponse.json({ dialogue });
}