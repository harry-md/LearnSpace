import React, { useContext } from "react";
import { ChatContext, UserContext } from "@/configs/Context";
import ChatWindow from "./ChatWindow";

const GlobalChatContainer = () => {
  const [chatState] = useContext(ChatContext);
  const [user] = useContext(UserContext);

  if (
    !user ||
    !chatState ||
    !chatState.activeChats ||
    chatState.activeChats.length === 0
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-0 right-20 z-[9999] flex items-end gap-4 pointer-events-none">
      {chatState.activeChats.map((chat) => (
        <div key={chat.id} className="pointer-events-auto">
          <ChatWindow chatData={chat} />
        </div>
      ))}
    </div>
  );
};

export default GlobalChatContainer;
