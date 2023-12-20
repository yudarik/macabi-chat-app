import mongoose, { Schema } from "mongoose";

export interface IMessage extends Document {
    content: string;
    from: string;
    to: string;
    room: string;
    timestamp: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
    content: { type: "String", required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    timestamp: { type: "Date", default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;