import Message from "@/components/chat/Message";
import type { DialogueMessageType } from "@/types/chat";
import { useChatStore } from "@/stores/chat";

export default function MessageList(
  { ready }: 
  { ready: boolean }) {
    
  const dialogueMessage = useChatStore((state) => state.dialogueMessage);

  
  return (
    <div className="flex-1 flex flex-col gap-8 w-full md:max-w-3xl pb-25" style={{ visibility: ready ? "visible" : "hidden" }}>
      {dialogueMessage.map((message: DialogueMessageType) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  );
}
