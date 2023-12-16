import * as express from "express";

import {
  registerUser,
  loginUser,
  allUsers,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/allUsers", allUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;