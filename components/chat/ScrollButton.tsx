import { RefObject } from "react";
import AIReplyIcon from "@/components/ui/AIReplySvgIcon";
import DownArrowSvgIcon from "@/components/ui/DownArrowSvgIcon";
import { useChatStore } from "@/stores/chat";
import { useParams } from "next/navigation";

export default function ScrollButton({
  isScrollToBottom,
  setIsScrollToBottom,
  chatContainerRef,
}: {
  isScrollToBottom: boolean; 
  setIsScrollToBottom: React.Dispatch<React.SetStateAction<boolean>>;
  chatContainerRef: RefObject<HTMLDivElement | null>;
}) {


  const { id: activeDialogueID } = useParams();

  const isLoading = useChatStore((state) => state.isLoading);

  return (
    <>
      {activeDialogueID && !isScrollToBottom && (
        <div
          className="testtest fixed bottom-26 flex items-center justify-center gap-2 bg-white p-1.5 rounded-[50%] shadow cursor-pointer"
          onClick={() => {
            setIsScrollToBottom(true);
            //滚动到最底部
            chatContainerRef.current?.scrollTo({
              top: chatContainerRef.current?.scrollHeight,
              behavior: "smooth",
            });
          }}
        >
          {/* ai回复中图标 */}
          {isLoading && <AIReplyIcon />}
          {/* 下箭头图标 */}
          {!isLoading && <DownArrowSvgIcon />}
        </div>
      )}
    </>
  );
}
