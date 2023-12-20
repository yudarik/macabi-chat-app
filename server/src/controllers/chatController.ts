import Room from "../models/roomModel";
import {Response, Request} from "express";

const createRoom = async (req: Request, res: Response) => {
    const { name } = req.body;
    const room = new Room({ name });
    await room.save();
    res.send(room);
};

const getRooms = async (req: Request, res: Response) => {
    const rooms = await Room.find({});
    res.send(rooms);
}

const joinRoom = async (req: Request, res: Response) => {
    const { userId, roomName } = req.body;
    const room = await Room.find({ name: roomName });
    if (!room) {
        res.status(404).send({ message: 'Room not found' });
        return;
    }
    // add user to room
    if (userId && room.users.indexOf(userId) === -1) {
        room.users.push(userId);
        await room.save();
    }
    res.status(200).send({ message: 'Joined room' });
}

const leaveRoom = async (req: Request, res: Response) => {
    const { userId, roomName } = req.body;
    const room = await Room.find({ name: roomName });
    if (!room) {
        res.status(404).send({ message: 'Room not found' });
        return;
    }
    // remove user from room
    if (userId && room.users.indexOf(userId) !== -1) {
        room.users.splice(room.users.indexOf(userId), 1);
        await room.save();
    }
    res.status(200).send({ message: 'Left room' });
}

export { createRoom, getRooms, joinRoom, leaveRoom };