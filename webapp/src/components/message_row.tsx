import React from "react";

export interface Message {
    sender: {
        id: string;
        username: string;
    };
    content: string;
}

export function Message_row(props: {msg: Message, index: number}) {
    const {msg, index} = props;
    return (
        <li key={index} className={'flex flex-row items-start mb-4'}>
            <span className={'bg-blue-500 text-white p-2 rounded-xl mx-1'}>{msg.sender.username}</span>
            <p className={'bg-gray-500 p-2 rounded-lg'}>{msg.content}</p>
        </li>
    )
}