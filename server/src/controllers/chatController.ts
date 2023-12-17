import {Server, Socket} from "socket.io";
import {Room} from "socket.io-adapter";
import {Server as HttpServer} from "http";

export interface ChatData {
    room: Room;
    content: string;
}

export class ChatSocket {

    private io: Server;
    private users: Map<string, {id: string, username: string}>;

    constructor(server: HttpServer) {
        this.io = new Server(server)
        this.users = new Map();
    }

    private socketConnectionHandler = (socket: Socket) => {
        console.log('User connected:', socket.id);

        // Add user
        socket.on('addUser', (username: string) => {
            console.log('user joined:', username)
            this.users.set(socket.id, {id: socket.id, username});
            this.io.emit('getUsers', Object.values(this.users));
        });

        // Get user
        socket.on('getUser', () => {
            this.io.to(socket.id).emit('getUser', this.users.get(socket.id));
        });

        // Get users
        socket.on('getUsers', () => {
            this.io.to(socket.id).emit('getUsers', Object.values(this.users));
        });

        // Delete user
        socket.on('deleteUser', () => {
            this.users.delete(socket.id);
            this.io.emit('getUsers', Object.values(this.users));
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

        // Message event
        socket.on('message', (data: ChatData) => {
            console.log('message received', data);
            try {
                this.io.to(data.room).emit('message', {
                    sender: this.users.get(socket.id),
                    content: data.content,
                });
            } catch (error) {
                console.log(error);
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            this.users.delete(socket.id);
            this.io.emit('getUsers', Object.values(this.users));
            console.log('User disconnected:', socket.id);
        });
    }

    public listen() {
        this.io.on('connection', this.socketConnectionHandler);
    }

}