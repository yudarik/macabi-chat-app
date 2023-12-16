import React, { useState, useEffect } from 'react';
import io, {Socket} from 'socket.io-client';
import {Message, Message_row} from "./message_row";


export default function Chat() {
    const [room, setRoom] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);


    const joinRoom = () => {
        socket?.emit('joinRoom', room);
    };

    const sendMessage = (event) => {
        event.preventDefault();
        console.log('sending message', inputMessage);
        socket?.emit('message', {
            room,
            content: inputMessage
        });
        setInputMessage('');
    };

    useEffect(() => {
        setSocket(
            io('http://localhost:8000', {
                transports: ['websocket'],
            })
        );
        // log when connected
        socket?.on('connect', () => {
            console.log('connected to server');
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
    }, []);

  return (
    <div className={'card flex w-full absolute top-0 bottom-0 left-0 right-0'}>
        {/*<input type="text" placeholder="Enter room" value={room} onChange={(e) => setRoom(e.target.value)} />*/}
        {/*<button onClick={joinRoom}>Join Room</button>*/}
        <ul className={'w-full'}>
            {messages.map((msg, index) => <Message_row key={index} msg={msg} index={index} />)}
        </ul>
        <div className={'flex w-full h-30 absolute bottom-0'}>
            <form onSubmit={sendMessage} className={'w-full flex'}>
                <input
                    className="flex-grow p-2 focus:outline-none"
                    type="text"
                    placeholder={'Enter message'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onSubmit={sendMessage}
                />
                <button type='submit'
                        className="bg-blue-700 text-white p-2 rounded-none">Send</button>
            </form>
        </div>
    </div>
  );
}