import {Server} from "socket.io";
import {Room} from "socket.io-adapter";
import {Server as HttpServer} from "http";


const createChatServer = (server: HttpServer) => {

    const io = new Server(server);

    const users = new Map<string, { id: string; username: string }>();

    interface ChatData {
        room: Room;
        content: string;
    }

    io.on('connection',(socket) => {
        console.log('User connected:', socket.id);

        // Add user
        socket.on('addUser', (username: string) => {
            console.log('user joined:', username)
            users.set(socket.id, {id: socket.id, username});
            io.emit('getUsers', Object.values(users));
        });

        // Get user
        socket.on('getUser', () => {
            io.to(socket.id).emit('getUser', users.get(socket.id));
        });

        // Get users
        socket.on('getUsers', () => {
            io.to(socket.id).emit('getUsers', Object.values(users));
        });

        // Delete user
        socket.on('deleteUser', () => {
            users.delete(socket.id);
            io.emit('getUsers', Object.values(users));
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
                io.to(data.room).emit('message', {
                    sender: users.get(socket.id),
                    content: data.content,
                });
            } catch (error) {
                console.log(error);
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            users.delete(socket.id);
            io.emit('getUsers', Object.values(users));
            console.log('User disconnected:', socket.id);
        });
    });
}

export {createChatServer}