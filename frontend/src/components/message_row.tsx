import {IConnectedUser} from "../chat/chat_store";

export interface IMessage {
  content: string;
  from: string;
  to?: string;
  room_id?: string;
  timestamp: Date;
}

export function MessageRow(props: { msg: IMessage; user: IConnectedUser }) {
  const { msg, user } = props;
  return (
    <li className={"flex flex-row items-start mb-4"}>
      <span className={"bg-blue-500 text-white p-2 rounded-xl mx-1"}>
        {user.username}
      </span>
      <p className={"bg-gray-500 p-2 rounded-lg"}>{msg.content}</p>
    </li>
  );
}
