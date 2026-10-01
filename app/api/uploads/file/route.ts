import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import crypto from "crypto";

// 上传文件
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }
    // 先判断文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "文件类型错误" }, { status: 400 });
    }
    // 限制文件大小
    if (file.size > 1024 * 1024 * 4) {
      return NextResponse.json(
        { error: "文件大小不能超过4MB" },
        { status: 400 },
      );
    }

    //映射文件扩展名
    const extMap: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/gif": "gif",
      "image/webp": "webp",
    };

    if (!extMap[file.type]) {
      return NextResponse.json(
        { error: "文件类型错误，仅支持png、jpg、gif、webp格式" },
        { status: 400 },
      );
    }
    // 生成文件名
    const fileName = `${crypto.randomUUID()}.webp`;
    // 上传目录
    const dir = process.env.UPLOAD_DIR;
    if (!dir) {
      return NextResponse.json({ error: "上传目录未配置" }, { status: 500 });
    }
    const uploadDir = path.join(dir, "files");

    // 创建上传目录
    await mkdir(uploadDir, { recursive: true });
    // 上传文件路径

    const filePath = path.join(uploadDir, fileName);
    // 写入文件
    const buffer = Buffer.from(await file.arrayBuffer());
    // 压缩图片
    const compressedBuffer = await sharp(buffer)
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 80 })
      .toBuffer();
    // 写入文件
    await writeFile(filePath, compressedBuffer);
    return NextResponse.json({ url: `/uploads/ai-chat/files/${fileName}` });
    // return NextResponse.json({ url: "https://images.dog.ceo/breeds/weimaraner/n02092339_2239.jpg" });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 });
  }
}
