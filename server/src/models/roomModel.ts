import mongoose, {Schema} from 'mongoose';
import {ObjectId} from "bson";

export interface IRoom {
    _id: ObjectId;
    name: string;
    members: ObjectId[];
}
const roomSchema = new mongoose.Schema<IRoom>({
    name: { type: "String", required: true, unique: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
});

export const Room = mongoose.model("Room", roomSchema);

