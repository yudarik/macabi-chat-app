import * as express from 'express';
import authRoutes from './authRoutes';
import chatRoutes from "./chatRoutes";
import messageRoutes from "./messageRoutes";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/room', chatRoutes)
router.use('/message', messageRoutes);

export default router;