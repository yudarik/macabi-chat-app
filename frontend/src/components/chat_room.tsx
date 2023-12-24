import { IMessage, MessageRow } from "./message_row";
import {FormEvent, useEffect, useMemo, useState} from "react";
import { useChat } from "./chat_provider";
import { useParams } from "react-router-dom";
import {IConnectedUser} from "../chat/chat_store";

export function ChatRoom(props: {
    msgCounter: number;
    onMessageSend: (content: string) => void,
}) {
    const { room_id } = useParams();
    const {chatStore} = useChat();
    const [inputMessage, setInputMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);

    const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onMessageSend(inputMessage);
        setInputMessage("");
    };

    useEffect(() => {
        setMessages(chatStore.getMessages(room_id));
    }, [room_id, props.msgCounter])

  return (
    <div className={"grow w-7/6 relative"}>
      <ul className={"w-full"}>
        {messages.map((msg, index) => (
            <MessageRow
                key={`${new Date(msg.timestamp).getMilliseconds()}_${index}`}
                msg={msg} user={chatStore.getUser(msg.from)} />
        ))}
      </ul>
      <div className={"flex w-full h-30 absolute left-0 right-0 bottom-0"}>
        <form onSubmit={onSubmitHandler} className={"w-full flex"}>
          <input
            className="flex-grow p-2 focus:outline-none"
            type="text"
            placeholder={"Enter message"}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-700 text-white p-2 rounded-none"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
