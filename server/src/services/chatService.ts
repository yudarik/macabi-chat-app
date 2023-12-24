import {Server, Socket} from "socket.io";
import {Server as HttpServer} from "http";
import {Room} from "../models/roomModel";
import User from "../models/userModel";

export interface Message {
    content: string;
    from: string;
    to?: string;
    room_id?: string;
    timestamp: Date;
}

export interface IConnectedUser {
    id: string,
    username: string
}

export class ChatService {

    private io: Server;
    private readonly usersById: Map<string, IConnectedUser>;
    private readonly usersBySocket: Map<string, IConnectedUser>;

    constructor(server: HttpServer) {
        this.io = new Server(server)
        this.usersById = new Map();
        this.usersBySocket = new Map();
        this.io.sockets.adapter.rooms.clear();
    }

    private socketConnectionHandler = (socket: Socket) => {
        // Add user
        socket.on('addUser', async (_id: string) => {
            console.log('user joined:', _id);
            // get user by name from DB
            const user = await User.findOne({ _id });
            if (!user) {
                console.log('user not found');
                return;
            }
            const userObj = {
                id: user?._id.toString(),
                username: user?.username,
            };
            this.usersById.set(user.id, userObj);
            this.usersBySocket.set(socket.id, userObj);
            this.io.emit('getUsers', Array.from(this.usersById.values()) as any);
        });

        // Get users
        socket.on('getUsers', () => {
            this.io.to(socket.id).emit('getUsers', Array.from(this.usersById.values()) as any);
        });

        // Delete user
        socket.on('deleteUser', (userId: string) => {
            this.usersById.delete(userId);
            this.io.emit('getUsers', Array.from(this.usersById.values()) as any);
        });

        // Join room
        socket.on('joinRoom', (room_id: string) => {
            socket.join(room_id);
            //console.log(`User ${socket.id} joined room: ${room_id}`);
        });

        // refresh rooms for all users
        socket.on('refreshRooms', async () => {
            const rooms = await Room.find({}).exec();
            this.io.emit('getRooms', rooms as any);
        });

        // get Rooms
        socket.on('getRooms', async () => {
            const rooms = await Room.find({}).exec();
            this.io.to(socket.id).emit('getRooms', rooms as any);
        });


        // Leave room
        socket.on('leaveRoom', (room_id: string) => {
            socket.leave(room_id);
        });

        // Message event
        socket.on('message', (msg: Message) => {
            //console.log('message received', msg);
            try {
                this.io.to(msg.room_id as string).emit('message', msg);
            } catch (error) {
                console.log(error);
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            this.usersBySocket.delete(socket.id);
            this.io.emit('getUsers', Array.from(this.usersById.values()) as any);
            console.log('User disconnected:', socket.id);
        });
    }

    public listen() {
        this.io.on('connection', this.socketConnectionHandler);
    }

}