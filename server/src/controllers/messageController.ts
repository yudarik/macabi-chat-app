import Message, {IMessage} from "../models/messageModel";
import {Response, Request} from "express";


const addMessage = async (req: Request, res: Response) => {
    const { room } = req.params;
    const { content, sender, timestamp }: IMessage = req.body;

    const message = new Message<IMessage>({ content, sender, room, timestamp });
    await message.save();
    res.status(200).send(message);
}

const getMessages = async (req: Request, res: Response) => {
    const { room } = req.params;
    const messages = await Message.find({room});
    res.send(messages);
}

export { addMessage, getMessages };