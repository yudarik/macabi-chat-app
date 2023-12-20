import * as express from 'express';
import * as http from 'http';
import * as cors from 'cors';

import routes from './routes';
import connectDB from "./config/db";
import {ChatService} from "./services/chatService";

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your client URL
  methods: ['GET', 'POST'],
};

const app = express();
connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', routes);


const server = http.createServer(app);
const chat = new ChatService(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
chat.listen();