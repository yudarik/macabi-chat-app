import io, { Socket } from "socket.io-client";
import { createContext, JSX, useContext, useEffect, useState } from "react";
import { Message } from "./message_row";
import { useAuth } from "../auth/auth_provider";

export interface IChatContext {
  socket: Socket | null;
  sendMessage: (room: string, content: string) => void;
  joinRoom: (room: string) => void;
}

const ChatContext = createContext<IChatContext>({
  socket: null,
  sendMessage: () => {},
  joinRoom: () => {},
});

export function ChatProvider(props: { children: JSX.Element[] | JSX.Element }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  const sendMessage = (room: string, content: string) => {
    console.log("sending message", content);
    socket?.emit("message", {
      room,
      content,
      sender: user?.username,
      timestamp: new Date(),
    } as Message as any);
  };

  const joinRoom = (room: string) => {
    socket?.emit("joinRoom", room as any);
    socket?.emit("getRooms");
  };

  useEffect(() => {
    const soc = io("http://localhost:8000", {
      autoConnect: true,
      transports: ["websocket"],
    });
    setSocket(soc);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        socket,
        sendMessage,
        joinRoom,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
