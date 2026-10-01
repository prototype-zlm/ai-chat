//md转react组件
import ReactMarkdown from "react-markdown";
//gfm插件，用于增强markdown的功能
import remarkGfm from "remark-gfm";
//highlight插件，用于高亮代码块
import rehypeHighlight from "rehype-highlight";

import CopySvgIcon from "@/components/ui/CopySvgIcon";
import { useToastStore } from "@/stores/toast";
import React, { useRef } from "react";

const MyMarkdown = React.memo(({ children }: { children: string }) => {
  const addToast = useToastStore((state)=>state.addToast);

  //pre代码块复制按钮
  function CodeBlock(props: any) {
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = async () => {
      try {
        const text = preRef.current?.textContent ?? "";
        await navigator.clipboard.writeText(text);
        addToast({ type: "success", message: "复制成功" });
      } catch (error: any) {
        addToast({ type: "error", message: `复制失败,错误信息为：${error.message}` });
      }
    };

    return (
      <div className="relative w-full min-w-0">
        <button
          className="cursor-pointer absolute right-2 top-2 z-10"
          onClick={handleCopy}
        >
          <CopySvgIcon />
        </button>

        <pre ref={preRef} {...props} />
      </div>
    );
  }

  const remarkPlugins = [remarkGfm];
  const rehypePlugins = [rehypeHighlight];
  const markdownComponents = {
    pre: CodeBlock,
  };

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={markdownComponents}
    >
      {children}
    </ReactMarkdown>
  );
});
export default MyMarkdown;
