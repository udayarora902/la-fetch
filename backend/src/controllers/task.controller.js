import Task from "../models/task.model.js";
import mongoose from "mongoose";

// Create task (admin only)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (err) {
    next(err);
  }
};

// Get all tasks (admin and user)
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email role");
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get single task
export const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email role"
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Update task (admin OR assigned user)
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // user role can only update own tasks
    if (req.user.role === "user") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this task" });
      }
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Task updated",
      task: updated,
    });
  } catch (err) {
    next(err);
  }
};

// Delete task (admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
