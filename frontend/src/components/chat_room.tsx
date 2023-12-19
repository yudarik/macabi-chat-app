import { Message, MessageRow } from "./message_row";
import { FormEvent, useState } from "react";
import { useChat } from "./chat_provider";
import { useParams } from "react-router-dom";

export function ChatRoom(props: { messages: Message[] }) {
  const { messages } = props;
  const { sendMessage } = useChat();
  const { room_name } = useParams();
  const [inputMessage, setInputMessage] = useState("");

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(room_name ?? "", inputMessage);
    setInputMessage("");
  };

  return (
    <div className={"grow w-7/6 relative"}>
      <h3>Room: {room_name}</h3>
      <ul className={"w-full"}>
        {messages.map((msg, index) => (
          <MessageRow key={index} msg={msg} index={index} />
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
