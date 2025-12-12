import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
} from "../controllers/user.controller.js";
import { protectRoute, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// register user (admin only)
router.post("/", protectRoute, authorize("admin"), registerUser);

// login user (public route)
router.post("/login", loginUser);

// get all users (admin only)
router.get("/", protectRoute, authorize("admin"), getUsers);

export default router;
