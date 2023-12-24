import * as express from "express";
import {addMessage, getMessages} from "../controllers/messageController";

const router = express.Router();

router.post("/:room_id", addMessage);
router.get("/:room_id/all", getMessages);

export default router;

