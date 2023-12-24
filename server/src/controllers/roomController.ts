import {Room} from "../models/roomModel";
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
    const { room_id } = req.params;
    const { userId } = req.body;
    try {
        if (!userId || !room_id) {
            res.status(400).send({message: 'no room or user id provided'});
            return;
        }
        let instance = await Room.findOne({ _id: room_id }).populate('members').exec();
        if (!instance) {
            res.status(404).send({ message: 'Room not found' });
            return;
        }
        // add user to room
        if (userId && instance.members.indexOf(userId) === -1) {
            instance.members.push(userId);
            await instance.save().then(() => {}, (err) => console.log.bind(console, `Error: ${err}`));
        }
        res.status(200).send({ message: 'Joined room' });
    } catch (err) {
        console.log.bind(console, `Error: ${err}`);
        res.status(400).send({ message: 'Error joining room' });
    }

}

const leaveRoom = async (req: Request, res: Response) => {
    console.log('Entered leaveRoom api handler')
    const { room_id } = req.params;
    const { userId } = req.body;
    try {
        const instance = await Room.findOne({ id: room_id }).populate('members').exec();
        if (!instance) {
            res.status(404).send({ message: 'Room not found' });
            return;
        }
        // remove user from room
        if (userId && instance.members.indexOf(userId) !== -1) {
            instance?.members.splice(instance?.members.indexOf(userId), 1);
            await instance.save();
        }
        res.status(200).send({ message: 'Left room' });
    } catch (err) {
        console.log.bind(console, `Error: ${err}`);
        res.status(400).send({ message: 'Error leaving room' });
    }
}

export { createRoom, getRooms, joinRoom, leaveRoom };