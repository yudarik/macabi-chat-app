import {FormEvent, useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import { IConnectedUser } from "./chat_orchestrator";
import {IRoom, useChat} from "./chat_provider";

export interface SocketUser {
  userId: string;
  socketId: string;
  username: string;
}

export function RoomItem(room: IRoom, index: number, is_active: boolean) {

  return (
    <li
      key={index}
      className={`p-4 hover:bg-gray-600 transition ${
        is_active ? "bg-gray-500" : ""
      }`}
    >
      <Link to={`/chat/${room._id}`} className="block">
        <span className="text-lg font-medium text-white">{room.name}</span>
      </Link>
    </li>
  );
}

export function UserItem(user: SocketUser, index: number) {
  const { user_id } = useParams();

  return (
    <li
      key={index}
      className={`p-4 hover:bg-gray-600 transition ${
        user.userId === user_id ? "bg-gray-500" : ""
      }`}
    >
      <Link to={`/chat/${user.socketId}`} className="block">
        <span className="text-lg font-medium text-white">{user.username}</span>
      </Link>
    </li>
  );
}

export function RoomsManager(props: {
  rooms: IRoom[];
  createRoom: (room_name: string) => void;
}) {
  const {room_id} = useParams<{ room_id: string }>();
  const [newRoom, setNewRoom] = useState<string>("");
  const { rooms, createRoom } = props;

  async function addRoom(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    createRoom(newRoom);
    setNewRoom("");
  }

  return (
    <div
      className={
        "flex flex-none items-start justify-center min-h-screen border-r-2 border-gray-500"
      }
    >
      <div className="flex flex-col w-full max-w-md mb-4 content-start">
        <div className="flex flex-row h-10">
          <form onSubmit={addRoom}>
            <input
              type="text"
              className="flex-grow p-2 focus:outline-none"
              placeholder="Type name for new room"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
            />
            <button
              className="bg-green-700 text-white p-2 rounded-none"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
        <div className="w-full">
          <ul className="divide-y divide-gray-200 flex-col">
            {rooms.map((room, i) => RoomItem(room, i, room._id === room_id))}
          </ul>
          {/*<ul className="border-t-2 border-gray-400 divide-y divide-gray-200 flex-col">*/}
          {/*  {users.map(UserItem)}*/}
          {/*</ul>*/}
        </div>
      </div>
    </div>
  );
}