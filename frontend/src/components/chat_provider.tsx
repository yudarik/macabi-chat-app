import { createContext, JSX, useContext} from "react";
import { IMessage } from "./message_row";
import { useAuth } from "../auth/auth_provider";
import request from "../protocols/api";
import {ChatStoreService, IConnectedUser} from "../chat/chat_store";


export interface IRoom {
    _id: string;
    name: string;
    members: string[];
}

export interface IChatContext {
  chatStore: ChatStoreService | null;
  createRoom: (name: string) => Promise<void>;
  joinRoom: (room_id: string) => Promise<{ message: string }>;
  leaveRoom: (room_id: string) => Promise<void>;
  getRooms: () => Promise<IRoom[]>;
  getMessages: (room_id: string) => Promise<IMessage[]>;
}

const ChatContext = createContext<IChatContext | null>(null);

export function ChatProvider(props: { children: JSX.Element[] | JSX.Element }) {
  const { user } = useAuth();

  const chatStore = ChatStoreService.getInstance();

  chatStore.setUsers([user as IConnectedUser]);

  const createRoom = async (name: string): Promise<void> => {
    try {
      return await request.post("/room/create", { name });
    }
    catch (err) {
      console.log(err);
    }
  }

  const joinRoom = async (room_id: string): Promise<{ message: string}> => {
    try {
      const res = await request.post(`/room/${room_id}/join`, { userId: user?.id });
      if (res.status === 200) {
        return res.data;
      }
    } catch (err) {
        console.log(err);
    }
  };

  const leaveRoom = async (room_id: string): Promise<void> => {
    try {
      const res = await request.post(`/room/${room_id}/leave`, { userId: user?.id });
      if (res.status === 200) {
        //socket?.emit("leaveRoom", room_id as any);
      }
    } catch (err) {
        console.log(err);
    }
  }

  const getRooms = async (): Promise<IRoom[]> => {
    try {
      const res = await request.get("/room/all");
      if (res.status === 200) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const getMessages = async (room_id: string): Promise<IMessage[]> => {
    try {
      const res = await request.get(`/room/${room_id}/messages`);
      if (res.status === 200) {
        return res.data;
      }
      return [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const value: IChatContext = {
    chatStore,
    createRoom,
    joinRoom,
    leaveRoom,
    getRooms,
    getMessages,
  };

  return (
    <ChatContext.Provider
      value={value}
    >
      {props.children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
