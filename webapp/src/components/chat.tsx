import React from 'react';
import {ChatProvider} from "./chat_provider";
import {ChatOrchestrator} from "./chat_orchestrator";


export default function Chat() {

  return (
    <div className={'flex w-full absolute mt-12 top-0 bottom-0 left-0 right-0'}>
        <ChatProvider>
            <ChatOrchestrator />
        </ChatProvider>
    </div>
  );
}