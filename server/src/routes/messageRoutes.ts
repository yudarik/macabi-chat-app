import * as express from "express";
import {addMessage, getMessages} from "../controllers/messageController";

const router = express.Router();

router.post("/:room", addMessage);
router.get("/:room/all", getMessages);

export default router;

