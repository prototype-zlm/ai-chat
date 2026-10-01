"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useChatStore } from "@/stores/chat";


// 滚动状态管理hooks
export function useScroll() {

  const dialogueMessage = useChatStore(state => state.dialogueMessage);
  const ready = useChatStore(state => state.ready);

  const setReady = useChatStore(state => state.setReady);



  // 聊天容器引用
  const chatContainerRef = useRef<HTMLDivElement>(null);

  //是否滚动到最底部
  const [isScrollToBottom, setIsScrollToBottom] = useState<boolean>(true);

  //是否滚动到最顶部
  const [isScrollToTop, setIsScrollToTop] = useState<boolean>(false);


  // 监听滚动事件，判断是否滚动到最底部 or 最顶部
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const scrollTopHandler = (e: Event) => {
      // 滚动距离
      const target = e.target as HTMLElement;

      const { scrollTop, clientHeight, scrollHeight } = target;
      

      // 滚动距离 + 可视区高度 >= 实际高度，说明滚动到最底部

      if (scrollTop >= scrollHeight - clientHeight) {
        setIsScrollToBottom(true);
      } else {
        setIsScrollToBottom(false);
      }

      // 滚动距离 <= 0，说明滚动到最顶部
      if (scrollTop <= 0) {
        setIsScrollToTop(true);
        console.log("滚动到最顶部");
      } else {
        setIsScrollToTop(false);
      }
    };
    el.addEventListener("scroll", scrollTopHandler);
    return () => {
      el.removeEventListener("scroll", scrollTopHandler);
    };
  }, []);

  /**
   * useLayoutEffect会在dom生成，但是浏览器绘制前执行
   * useEffect会在dom生成，绘制完成后执行
   */
  // 每次消息列表变化时，都滚动到最底部
  useLayoutEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
    setReady(true);
  }, [dialogueMessage.length]);

  return {
    chatContainerRef,
    isScrollToBottom,
    setIsScrollToBottom,
    isScrollToTop,
    ready,
  }
}
