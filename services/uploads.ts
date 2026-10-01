// 上传头像
export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch("/api/uploads/avatar", {
    method: "POST",
    body: formData,
  });
}


//上传文件
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetch("/api/uploads/file", {
    method: "POST",
    body: formData,
  });
}

