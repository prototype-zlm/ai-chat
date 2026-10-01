import ChatView from "@/components/chat/ChatView";



export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  
  //对话id
  const { id: dialogueId } = await params;
  console.log(dialogueId);


  return (
    <ChatView />
  );
}
