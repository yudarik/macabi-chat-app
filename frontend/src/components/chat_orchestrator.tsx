import {useEffect, useState} from "react";
import io, { Socket } from "socket.io-client";
import { IMessage } from "./message_row";
import {IRoom, useChat} from "./chat_provider";
import { ChatRoom } from "./chat_room";
import {useParams} from "react-router-dom";
import { RoomsManager } from "./rooms_manager";
import {useAuth} from "../auth/auth_provider";


export function ChatOrchestrator() {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [activeSocket, setActiveSocket] = useState<Socket | null>(null);
  const [msgCounter, setMsgCounter] = useState(0);
  const { joinRoom, createRoom, chatStore } = useChat();
  const { user } = useAuth();
  const { room_id } = useParams();

  function handleMessageReceive(msg: IMessage) {
    console.log("received message", msg);
    chatStore.addMessage(msg);
    setMsgCounter(prev => prev + 1);
  }

  function createRoomHandler(name: string) {
    createRoom(name).then(() => {
        activeSocket?.emit("refreshRooms");
    });
  }

  function sendMessage(content: string): void {
    const message = {
      content,
      from: user?.id,
      room_id,
      timestamp: new Date(),
    }
    console.log("sending message", message);
    activeSocket?.emit("message", message as IMessage as any);
  }

  async function joinRoomHandler() {
    console.log("joining room", room_id);
    await joinRoom(room_id);
    if (activeSocket?.connected) {
      activeSocket?.emit("joinRoom", room_id as any);
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    const socket = io("http://localhost:8000", {
      autoConnect: true,
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      console.log("connected to server");
      socket.emit("addUser", user?.id);
      socket.emit("getRooms");
      socket.emit("getUsers");

      if (room_id) {
        socket.emit("joinRoom", room_id as any);
      }
      if (socket?.connected && socket.id !== socket.id) {
        socket.disconnect();
        return;
      }
      setActiveSocket(socket);

      if (!socket?.listeners("message").length) {
        socket?.on("message", handleMessageReceive);
      }
      if (!socket?.listeners("getRooms").length) {
        socket?.on("getRooms", setRooms);
      }
      if (!socket?.listeners("getUsers").length) {
          socket?.on("getUsers", users => chatStore.setUsers(users));
      }

    });

    return () => {
      socket?.disconnect();
    };
  }, [user]);

  useEffect(() => {
    joinRoomHandler();
  }, [room_id]);


  return (
    <>
      <div className={"flex flex-col"}>
        <RoomsManager rooms={rooms} createRoom={createRoomHandler} />
      </div>
      {room_id && <ChatRoom onMessageSend={sendMessage} msgCounter={msgCounter}/>}
      {!room_id && (
        <div
          className={
            "grow w-7/6 grid content-center relative justify-center text-center"
          }
        >
          <p className={"text-2xl whitespace-normal"}>
            Welcome to Macabi chat app please select a room or create a new one
          </p>
        </div>
      )}
    </>
  );
}
