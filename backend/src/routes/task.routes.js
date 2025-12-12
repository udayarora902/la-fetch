import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { protectRoute, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// create task (admin only)
router.post("/", protectRoute, authorize("admin"), createTask);

// get all tasks (admin or user)
router.get("/", protectRoute, authorize("admin", "user"), getTasks);

// get single task
router.get("/:id", protectRoute, authorize("admin", "user"), getTaskById);

// update task
router.put("/:id", protectRoute, authorize("admin", "user"), updateTask);

// delete task (admin only)
router.delete("/:id", protectRoute, authorize("admin"), deleteTask);

export default router;
