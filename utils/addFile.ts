export const HandleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  console.log(file);
  if (!file) return;

  try {
    //先判断文件类型
    if (file.type.startsWith("image/")) {
      const base64 = (await fileToBase64(file)) as string;
      const pureBase64 = base64.split(",")[1];
      return { type: "image", result: base64 };
    }
    return null;
  } catch (e) {
    console.error("转换失败", e);
  }
};

/**
 * File 转 base64
 * @param {File} file 文件对象
 * @returns {Promise<string>} base64字符串（带data:image/png;base64,前缀）
 */
function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    // 创建FileReader实例
    const reader = new FileReader();
    //注册事件回调，当文件读取完成时触发
    reader.onload = () => {
      //将base64编码的字符串作为Promise的resolve参数返回
      resolve(reader.result);
    };
    //注册事件回调，当文件读取失败时触发
    reader.onerror = (err) => reject(err);
    // 开始读取文件内容，将文件内容读取为base64编码
    reader.readAsDataURL(file);
  });
}