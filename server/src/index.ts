import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import { Room } from 'socket.io-adapter'
import * as cors from 'cors';

import routes from './routes';
import connectDB from "./config/db";

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your client URL
  methods: ['GET', 'POST'],
};

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);

app.post('/api/test', (req, res) => {
  const requestData = req.body;
  console.log('Received POST request with data:', requestData);

  // You can handle the data and send a response back
  res.json({ message: 'Request received successfully!', data: requestData });
});
app.get('/api/test', (req, res) => {
  const requestData = req.query;
  console.log('Received POST request with data:', requestData);

  // You can handle the data and send a response back
  res.json({ message: 'Request received successfully!', data: requestData });
});


const server = http.createServer(app);
const io = new Server(server);

// key, value pair of all users
const users = new Map<string, { id: string; username: string }>();

//const users: Set<{ id: string; username: string }> = new Map();

interface ChatData {
  room: Room;
  content: string;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Add user
  socket.on('addUser', (username: string) => {
    users.set(socket.id, { id: socket.id, username });
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
        io.emit('message', {
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

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});