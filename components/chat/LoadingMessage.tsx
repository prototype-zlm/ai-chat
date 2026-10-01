"use client";

import { useState, useEffect } from "react";

    

export default function LoadingMessage() {
  const [text, setText] = useState("");
  const fullText = "AI 正在思考...";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`message loading`}>
      <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-gray-500">{text}</span>
    </div>
  );
}
