import * as express from "express";
import {createRoom, getRooms, joinRoom, leaveRoom} from "../controllers/chatController";

const router = express.Router();

router.get("/create", createRoom);
router.post("/join", joinRoom);
router.get("/all", getRooms);
router.post("/leave", leaveRoom)

export default router;