import {useState} from "react";
import uuid4 from "uuid4";

export interface Room {
    id: string;
    name: string;
}

export function RoomsManager() {
    const [newRoom, setNewRoom] = useState<string>('');
    const [rooms, setRooms] = useState<Room[]>([]);

    function addRoom() {
        setRooms(prevRooms => [
            ...prevRooms,
            {
                id: uuid4(),
                name: newRoom
            }
        ]);
        setNewRoom('');
    }

    return (
        <div className={'flex flex-none items-start justify-center min-h-screen border-r-2 border-gray-500'}>
            <div className="flex flex-col w-full max-w-md mb-4 content-start">
                <div className="flex flex-row h-10">
                    <input type="text"
                           className="flex-grow p-2 focus:outline-none"
                           placeholder="Type name for new room"
                           value={newRoom}
                           onChange={(e) => setNewRoom(e.target.value)}
                    />
                    <button className="bg-green-700 text-white p-2 rounded-none"
                            onClick={addRoom}>Create</button>
                </div>
                <div className='w-full'>
                    <ul className='divide-y divide-gray-200 flex-col'>
                        {rooms.map(RoomItem)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function RoomItem(room, index) {
    function joinRoom() {
        //socket?.emit('joinRoom', room as any);
    }

    return (
        <li key={index}
             className={'p-4 hover:bg-gray-100 transition'}
             onClick={joinRoom}>
            <a href="#" className="block">
                <span className="text-lg font-medium text-blue-500">{room.name}</span>
            </a>
        </li>
    );
}