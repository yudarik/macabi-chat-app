import * as express from "express";
import {createRoom, getRooms, joinRoom, leaveRoom} from "../controllers/roomController";

const router = express.Router();

router.post("/create", createRoom);
router.get("/all", getRooms);
router.post("/:room_id/join", joinRoom);
router.post("/:room_id/leave", leaveRoom)

export default router;