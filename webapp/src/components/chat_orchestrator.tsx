import React, {useEffect, useMemo, useState} from "react";
import {Message} from "./message_row";
import {IChatContext, useChat} from "./chat_provider";
import {ChatRoom} from "./chat_room";
import {useParams} from "react-router-dom";
import {useAuth} from "../auth/auth_provider";
import {RoomsManager, UsersManager} from "./rooms_manager";

export interface IConnectedUser {
    userId: string,
    socketId: string,
    username: string
}

export function ChatOrchestrator() {
    const {socket, joinRoom} = useChat<IChatContext>();
    const {room_name} = useParams();
    const {user} = useAuth();
    const [messages, setMessages] = useState<Map<string, Message[]>>(new Map<string, Message[]>())
    const [rooms, setRooms] = useState<string[]>([]);
    const [users, setUsers] = useState<IConnectedUser[]>([]);

    useEffect(() => {
        socket?.on('connect', () => {
            console.log('connected to server');
            socket?.emit('addUser', user as any);
            socket?.emit('getRooms');
            socket?.emit('getUsers');
        });

        socket?.on('message', (msg: Message) => {
            console.log('received message', msg);
            setMessages(
                new Map(messages.set(msg.room, [...(messages.get(msg.room) || []), msg]))
            );
        });

        socket?.on('getRooms', (data: string[]) => {
            console.log('received rooms', data);
            setRooms(data);
        });

        socket?.on('getUsers', (data: IConnectedUser[]) => {
            console.log('received users', data);
            setUsers(data);
        });

        return () => {
          socket?.disconnect();
        };
    }, [socket]);


    function getRoomMessages(room_name: string) {
        return messages.get(room_name) || [];
    }

    return (
        <>
            <div className={'flex flex-col'}>
                <RoomsManager
                    rooms={rooms}
                    users={users}
                    joinRoom={joinRoom
                }/>
            </div>
            {
                room_name && <ChatRoom messages={getRoomMessages(room_name)} />
            }
            {
                !room_name && <div className={'grow w-7/6 grid content-center relative justify-center text-center'}>
                    <p className={'text-2xl whitespace-normal'}>Welcome to Macabi chat app
                        please select a room or create a new one</p>
                </div>
            }
        </>
    )
}