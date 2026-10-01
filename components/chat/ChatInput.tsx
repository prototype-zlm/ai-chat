"use client";

import { useState, useRef, useEffect ,useLayoutEffect} from "react";
import { useChat } from "@/hooks/useChat";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { sessionStore } from "@/utils/storage";
import AddSvgIcon from "@/components/ui/AddSvgIcon";
import { HandleAddFile } from "@/utils/addFile";
import { uploadFile } from "@/services/uploads"
import { packMessage } from "@/utils/packMessage"



interface addFile {
  type: "image";
  result: string;
}

export default function ChatInput() {
  const router = useRouter();
  // 认证状态管理hooks
  const { isLogin } = useAuth();
  // 消息状态管理hooks
  const { sendMessage: send } = useChat();

  //输入框状态
  const [input, setInput] = useState("");

  //用户上传的文件,数组的形式，其中对象包含两个参数，文件的类型和处理后的结果
  const [addFiles, setAddFiles] = useState<addFile[]>([]);

  //输入框引用
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  //文件缩略容器引用
  const fileContainerRef = useRef<HTMLDivElement>(null);

  //输入框内容改变时，自动调整高度
  const resizeTextarea = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;

    // 计算文件缩略容器的高度,未上传文件时高度为0
    const fileHeight =
        fileContainerRef.current?.offsetHeight ?? 0;

    //输入框的paddingTop为16px + 文件缩略容器的高度
    textarea.style.paddingTop = `${16 + fileHeight}px`;
 
    textarea.style.height = "auto";

    /**
     * 1.当输入框中的文字未换行时，输入框的高度为100px + 文件缩略容器的高度
     * 2.当输入框中的文字换行时，输入框的高度为scrollHeight，也就是完整的文字高度+padding，
     * 注意这里的padding其实已经包含了图片的高度，如果有的话，所以不用再+fileHeight了
     * */ 
    textarea.style.height =
        `${Math.max(100 + fileHeight, textarea.scrollHeight)}px`;
};
  //发送消息
  const sendMessage = () => {
    if (input.trim() === "") {
      return;
    }
    if (!isLogin) {
      sessionStore.save("input", input);
      router.push("/login");
      return;
    }
    // 发送消息
    send(packMessage(input, addFiles));
    setInput("");
    setAddFiles([]);
    //发送消息后，自动调整高度
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  //回车发送消息
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
      //防止回车发送之后换行
      e.preventDefault();
    }
  };
  
  // 文件上传
  const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // const result = await HandleAddFile(e) as addFile;
    // if (result) {
    //   setAddFiles((prev) => [...prev, result]);
    // }
    const file = e.target.files?.[0]
    if(!file) return
     const res = await uploadFile(file)
    
    const data = await res.json()

    //浏览器有缓存，加时间戳
    const fileUrl = data?.url + `?${Date.now()}`
    setAddFiles((prev) => [...prev, {type:"image", result: fileUrl}])
  }

  // 组件挂载时，从sessionStorage中获取输入框内容
  useEffect(() => {
    const input = sessionStore.load<string>("input");
    if (input) {
      setInput(input);
      textareaRef.current?.focus();
      sessionStore.remove("input");
    }
  }, []);

  // 当上传的文件变化时，自动调整输入框高度
  useLayoutEffect(() => {
    resizeTextarea();
  }, [addFiles]);

  return (
    <div className="w-full md:max-w-3xl sticky bottom-0 bg-white">
      <div className="w-full px-2 md:px-0 relative">
        {/* 这里将来用来展示上传的图片、文件的缩略图 */}
        {addFiles.length > 0 && <div 
        ref={fileContainerRef}
        className="w-full h-12 flex items-center absolute">
          {addFiles.map((file, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-md overflow-hidden absolute top-2"
              style={{ left: `${index * 56 + 8}px` }}
            >
              <img
                src={file.result}
                alt={file.type}
                className="w-full h-full object-cover rounded-md border-white border-2"
              />
              <div className="absolute top-0 right-0 w-4 h-4 bg-black/50 text-white text-sm rounded-full flex items-center justify-center cursor-pointer">
                {/* <DeleteSvgIcon className="text-white text-sm" /> */}
                 <span onClick={()=>{
                  setAddFiles((prev) => prev.filter((item, i) => i !== index));
                 }}>
                    x
                 </span>
              </div>
            </div>
          ))}
        </div>}
        {/* 输入框 */}
        <textarea
          className="textarea-container flex-1 w-full border border-gray-300 rounded-md outline-none resize-none focus:outline-none"
          style={{
            height:"100px",
            paddingTop:"16px",
            paddingBottom:"44px",
            paddingLeft:"16px",
            paddingRight:"16px",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={resizeTextarea}
          onKeyDown={handleEnter}
          placeholder="请输入消息"
          ref={textareaRef}
        />
        {/* 功能区 */}
        {/* 文件上传 */}
        <div className="absolute bottom-3 left-4 md:left-2 bg-[#f2f2f2] rounded-md p-1">
          <label htmlFor="inputAddFile">
            <AddSvgIcon className="cursor-pointer" />
          </label>
          <input
            type="file"
            hidden
            name="inputAddFile"
            id="inputAddFile"
            onChange={handleAddFile}
          />
        </div>
      </div>
    </div>
  );
}
