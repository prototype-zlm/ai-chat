import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import validator from "validator";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: "请输入邮箱和密码" },
        { status: 400 }
      );
    }
    // 验证邮箱格式
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { error: "邮箱格式错误" },
        { status: 400 }
      );
    }
    // 验证密码长度
    if (password.length < 6 || password.length > 20) {
      return NextResponse.json(
        { error: "密码长度必须在6到20之间" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || "",
    });

    return NextResponse.json(
      { message: "注册成功", userId: user._id },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "注册失败" },
      { status: 500 }
    );
  }
}