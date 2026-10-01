import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

//获取用户信息
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findOne({ _id: session.user.id }).select("-password");
  return NextResponse.json({ user });
}
//更新用户信息
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { name, avatar, password } = await req.json();
  await dbConnect();

  //密码加密

  let updateData = {} as any;

  if (name) {
    updateData.name = name;
  }
  if (avatar) {
    updateData.avatar = avatar;
  }
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);;
  }

  const updateUser = await User.findOneAndUpdate(
    { _id: session.user.id },
    { $set: updateData },
    { new: true, runValidators: true },
  ).select("-password");

  if (!updateUser) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  return NextResponse.json({ updateUser });
}
