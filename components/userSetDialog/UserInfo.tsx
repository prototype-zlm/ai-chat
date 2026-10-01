import { useState } from "react";
import { useUserStore } from "@/stores/user";
import { updateUserInfo } from "@/services/user";
import { useToastStore } from "@/stores/toast";
import { uploadAvatar } from "@/services/uploads";


export default function UserInfo() {

  const userInfo = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state)=>state.setUserInfo)
  const addToast = useToastStore((state) => state.addToast);

  const [password,setPassword] = useState<string>("")

  //上传头像
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const file = e.target.files?.[0]
    if(!file) return
    
    // 上传头像到服务器
    const res = await uploadAvatar(file)

    const data = await res.json()

    //浏览器有缓存，加时间戳
    const avatar = data?.url + `?${Date.now()}`

    setUserInfo((pre)=>{
       if(!pre) return null
       return {
        ...pre,
        avatar
       }
    })


    console.log("上传头像到服务器",data)
  };

  //提交更新
 const handleSave = async () => {
   try {
    if(!userInfo) return null
     await updateUserInfo({
       ...userInfo,
       password,
     });

     setPassword("");
     addToast({
       message: "更新成功",
       type: "success",
     });
   } catch (error) {
     addToast({
       message: `更新失败，失败的原因是：${error}`,
       type: "error",
     });
   }
 };
 if(!userInfo) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <span>头像：</span>
        <label htmlFor="userAvatar">
          {userInfo.avatar && (
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              className="w-12 h-12 rounded-full border-2 border-white cursor-pointer"
            />
          )}
        </label>
        <input
          type="file"
          hidden
          name="userAvatar"
          id="userAvatar"
          onChange={handleAvatarChange}
        />
      </div>
      <div>
        <span>邮箱：</span>
        {userInfo.email}
      </div>
      <label>
        <span>用户名：</span>
        <input
          type="text"
          placeholder="请输入用户名"
          value={userInfo.name}
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => {
            setUserInfo((pre) => {
              if (!pre) return null;
              return {
                ...pre,
                name: e.target.value,
              };
            });
          }}
        />
      </label>
      <label>
        <span>修改密码：</span>
        <input
          type="password"
          placeholder="请输入新的密码"
          value={password}
          className="border border-gray-300 rounded-md p-2"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </label>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer"
        onClick={handleSave}
      >
        保存
      </button>
    </div>
  );
}
