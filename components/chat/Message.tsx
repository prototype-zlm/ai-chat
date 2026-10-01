"use client";

import React, { useState } from "react";
import MyMarkdown from "@/components/tools/MyMarkdown";
import CopySvgIcon from "@/components/ui/CopySvgIcon";
import { useToastStore } from "@/stores/toast";
import type { DialogueMessageType } from "@/types/chat";
import LoadingMessage from "@/components/chat/LoadingMessage";
import { getTextContent } from "@/utils/getTextContent";



const Message = React.memo(({ message }: { message: DialogueMessageType }) => {
  const addToast = useToastStore((state)=>state.addToast);

  //思考过程是否展开
  const [showThinking, setShowThinking] = useState<string>("");


  if (message.role === "loading") {
    return (
      <LoadingMessage />
    );
  }
  return (
    <div
      className={`flex flex-col gap-2 ${message.role === "user" ? "items-end" : "items-start"} p-4`}
    >
      {message.thinking && (
        <div className="thinking markdown-body mb-2">
          <button
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-1"
            onClick={() =>
              setShowThinking((pre) => (pre === message._id ? "" : message._id))
            }
          >
            <svg
              className={`w-4 h-4 mr-1 transition-transform ${showThinking === message._id ? "rotate-90" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            思考过程
          </button>
          <div
            className={`overflow-auto transition-all duration-300 ${showThinking === message._id ? "max-h-125 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mt-2">
              <MyMarkdown>{message.thinking}</MyMarkdown>
            </div>
          </div>
        </div>
      )}
      {message.content && (
        <div className={`message ${message.role} markdown-body`}>
          <MyMarkdown>{getTextContent(message.content)}</MyMarkdown>
        </div>
      )}
      {
        typeof message.content === 'object' && message.content.length > 0 && (
          message.content.map((item) => (
            item.type === "image_url" && (
              <img
                key={item.image_url.url}
                src={item.image_url.url}
                alt={item.type}
                className="message image"
              />
            )
          ))
        )
      }
      <div className="flex items-end gap-4">
        {/* 复制按钮 */}
        <div
          className="cursor-pointer"
          onClick={async () => {
            // 复制文本到剪贴板
            try {
              await navigator.clipboard.writeText(getTextContent(message.content));
              addToast({ type: "success", message: "复制成功" });
            } catch (error) {
              addToast({ type: "error", message: `复制失败：${error}` });
            }
          }}
        >
          <CopySvgIcon />
        </div>
        {/* 重试按钮 */}
        {/* 分享按钮 */}
        {/* 时间信息 */}
        <div className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</div>
        {/* token信息 */}
        {message.usage && <div className="text-xs text-gray-500">token用量:{message.usage.total_tokens}</div>}
      </div>
    </div>
  );
});
export default Message;
