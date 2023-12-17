import React from 'react';
import {RoomsManager} from "./rooms_manager";
import {ChatRoom} from "./chat_room";
import {ChatProvider} from "./chat_provider";


export default function Chat() {

  return (
    <div className={'flex w-full absolute mt-12 top-0 bottom-0 left-0 right-0'}>
        <ChatProvider>
            <RoomsManager />
            <ChatRoom />
        </ChatProvider>
    </div>
  );
}