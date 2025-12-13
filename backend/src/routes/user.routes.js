import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
} from "../controllers/user.controller.js";
import { protectRoute, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// login user (public)
router.post("/login", loginUser);

// register user (ADMIN ONLY, after bootstrap)
router.post("/", protectRoute, authorize("admin"), registerUser);

// get all users (admin only)
router.get("/", protectRoute, authorize("admin"), getUsers);

export default router;
