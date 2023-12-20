import mongoose, { Document, Schema } from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { type: "String", required: true, unique: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message', default: [] }],
});

const Room = mongoose.model("Room", roomSchema);

export default Room;

