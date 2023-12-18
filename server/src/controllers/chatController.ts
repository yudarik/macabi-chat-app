import {Server, Socket} from "socket.io";
import {Server as HttpServer} from "http";
import User from "../models/userModel";

export interface Message {
    room: string;
    sender: string;
    content: string;
    timestamp: Date;
}

export interface IConnectedUser {
    userId: string,
    socketId: string,
    username: string
}

export class ChatSocket {

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
        console.log('User connected:', socket.id);

        // Add user
        socket.on('addUser', async (data: { id: string, username: string }) => {
            console.log('user joined:', data);
            // get user by name from DB
            const user = await User.findOne({ username: data.username });
            if (!user) {
                console.log('user not found');
                return;
            }
            const userObj = {
                userId: user.id,
                socketId: socket.id,
                username: user.username,
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
        socket.on('joinRoom', (room: string) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // Leave room
        socket.on('leaveRoom', (room: string) => {
            socket.leave(room);
        });

        // Get rooms
        socket.on('getRooms', () => {
            console.log('getRooms called');
            // Get all rooms
            const roomNames = Array.from(this.io.sockets.adapter.rooms.keys());
            console.log('available rooms:', roomNames);
            this.io.to(socket.id).emit('getRooms', roomNames);
        });

        // Message event
        socket.on('message', (msg: Message) => {
            console.log('message received', msg);
            try {
                this.io.to(msg.room).emit('message', msg);
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