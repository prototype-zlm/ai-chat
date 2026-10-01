import ChatLayout from "@/components/chat/ChatLayout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ChatLayout>
      {children}
    </ChatLayout>
  );
}
