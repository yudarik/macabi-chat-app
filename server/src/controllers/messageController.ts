import Message, {IMessage} from "../models/messageModel";
import {Response, Request} from "express";
import {ObjectId} from "bson";


const addMessage = async (req: Request, res: Response) => {
    const { room_id } = req.params;
    const { content, from, to, timestamp }: IMessage = req.body;

    const message = new Message<IMessage>({
        content,
        from,
        to,
        room: ObjectId.createFromHexString(room_id),
        timestamp
    });
    await message.save();
    res.status(200).send(message);
}

const getMessages = async (req: Request, res: Response) => {
    const { room_id } = req.params;
    const messages = await Message.find({room: room_id}, null, {
        sort: {timestamp: 'asc'},
        limit: 300
    }).populate('from', 'to').exec();
    res.send(messages);
}

export { addMessage, getMessages };