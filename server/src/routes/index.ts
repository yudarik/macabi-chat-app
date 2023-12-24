import * as express from 'express';
import authRoutes from './authRoutes';
import roomRoutes from "./roomRoutes";
import messageRoutes from "./messageRoutes";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/room', roomRoutes)
router.use('/message', messageRoutes);

export default router;