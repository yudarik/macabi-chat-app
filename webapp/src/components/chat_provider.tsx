import io, {Socket} from 'socket.io-client';
import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "../auth/auth_provider";

export interface IChatContext {
    socket: Socket | null;
    sendMessage: (room: string, user: string, content: string) => void;
}

const ChatContext = createContext<IChatContext>({
    socket: null,
    sendMessage: () => {},
});

export function ChatProvider({ children }) {
    const {user} = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);

    const sendMessage = (room: string, user: string, content: string) => {
        console.log('sending message', content);
        socket?.emit('message', {
            room,
            user,
            content,
        } as any);
    };

    useEffect(() => {
        const soc = io('http://localhost:8000', {
            autoConnect: true,
            transports: ['websocket'],
        });
        soc.on('connect', () => {
            console.log('connected to server');
            // socket?.emit('addUser', user as any);
            // socket?.emit('joinRoom', 'room' as any);
        });
        setSocket(soc);
    }, []);

    return (
        <ChatContext.Provider value={{
            socket,
            sendMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    return useContext(ChatContext);
}