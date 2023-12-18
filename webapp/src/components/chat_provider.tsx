import io, {Socket} from 'socket.io-client';
import {createContext, useContext, useEffect, useState} from "react";
import {Message} from "./message_row";
import {useAuth} from "../auth/auth_provider";

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

export function ChatProvider({ children }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const {user} = useAuth();

    const sendMessage = (room: string, content: string) => {
        console.log('sending message', content);
        socket?.emit('message', {
            room,
            content,
            sender: user.username,
            timestamp: new Date(),
        } as Message as any);
    };

    const joinRoom = (room: string) => {
        socket?.emit('joinRoom', room as any);
        socket?.emit('getRooms');
    }

    useEffect(() => {
        const soc = io('http://localhost:8000', {
            autoConnect: true,
            transports: ['websocket'],
        });
        setSocket(soc);
    }, []);

    // useEffect(() => {
    //     socket?.on('connect', () => {
    //         console.log('connected to server');
    //         //socket?.emit('addUser', user as any);
    //         //socket?.emit('joinRoom', room_name as any);
    //     });
    //
    //     // socket?.on('message', (msg: Message) => {
    //     //     console.log('received message', msg);
    //     //     setMessages(prevMessages => [
    //     //       ...prevMessages,
    //     //       msg
    //     //     ]);
    //     // });
    //
    //     return () => {
    //       socket?.disconnect();
    //     };
    // }, [socket]);

    return (
        <ChatContext.Provider value={{
            socket,
            sendMessage,
            joinRoom,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}