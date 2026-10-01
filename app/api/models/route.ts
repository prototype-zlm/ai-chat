import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Models from "@/models/Models";
import Users from "@/models/User";
import { authOptions } from "@/lib/auth";

//获取用户的模型列表
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  await dbConnect();
  const models = await Models.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ models });
}
//添加自定义模型
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { protocol,model,apiKey,baseUrl } = await req.json();
  await dbConnect();

  const createModel = await Models.create({
    userId: session.user.id,
    protocol,
    model,
    apiKey,
    baseUrl,
  });
  return NextResponse.json({ createModel });
}

//编辑自定义模型
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { modelId,protocol,model,apiKey,baseUrl } = await req.json();
  await dbConnect();

  const updateModel = await Models.findByIdAndUpdate(modelId, {
    protocol,
    model,
    apiKey,
    baseUrl,
  });
  return NextResponse.json({ updateModel });
}
//删除自定义模型
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { modelId } = await req.json();
  await dbConnect();

  const deleteModel = await Models.findByIdAndDelete(modelId);
  return NextResponse.json({ deleteModel });
}

//切换当前模型
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { modelId } = await req.json();
  await dbConnect();

  // 检查模型是否存在
  const model = await Models.findOne({ 
    userId: session.user.id,
    _id: modelId,
   });
  if (!model) {
    return NextResponse.json({ error: "模型不存在或无权限操作" }, { status: 404 });
  }

  await Users.findByIdAndUpdate(
    session.user.id,
    {
      $set: {
        activeModel: model._id,
      }
    }
  );
  return NextResponse.json({ activeModel: model._id });
}

