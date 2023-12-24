import { ChatProvider } from "./chat_provider";
import { ChatOrchestrator } from "./chat_orchestrator";
import {useEffect} from "react";

export default function Chat() {
    useEffect(() => {
        console.log('chat component mounted');
    }, []);
  return (
    <div className={"flex w-full absolute mt-14 top-0 bottom-0 left-0 right-0"}>
      <ChatProvider>
        <ChatOrchestrator />
      </ChatProvider>
    </div>
  );
}
