import {Message, Message_row} from "./message_row";
import React, {useEffect, useState} from "react";
import {IChatContext, useChat} from "./chat_provider";
import {useAuth} from "../auth/auth_provider";


export function ChatRoom() {
    const {user} = useAuth();
    const {socket, sendMessage} = useChat<IChatContext>();

    const [room, setRoom] = useState<string>('main');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();
        sendMessage(room, user, inputMessage);
        setInputMessage('');
    };

    useEffect(() => {
        console.log('connecting to server...');

        socket?.on('connect', () => {
            console.log('connected to server');
            socket?.emit('addUser', user as any);
            socket?.emit('joinRoom', room as any);
        });

        socket?.on('message', (msg) => {
            console.log('received message', msg);
            setMessages(prevMessages => [
              ...prevMessages,
              msg
            ]);
        });

        return () => {
          socket?.disconnect();
        };
    }, [socket]);

    return (
        <div className={'grow w-7/6 relative'}>
            <ul className={'w-full'}>
                {messages.map((msg, index) => <Message_row key={index} msg={msg} index={index} />)}
            </ul>
            <div className={'flex w-full h-30 absolute left-0 right-0 bottom-0'}>
                <form onSubmit={onSubmitHandler} className={'w-full flex'}>
                    <input
                        className="flex-grow p-2 focus:outline-none"
                        type="text"
                        placeholder={'Enter message'}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button type='submit'
                            className="bg-blue-700 text-white p-2 rounded-none">Send</button>
                </form>
            </div>
        </div>
    )
}