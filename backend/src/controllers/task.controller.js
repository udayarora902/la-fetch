import prisma from "../../lib/prisma.js";

// Create task (admin only)
export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo } = req.body;

    if (!title || !description || !assignedTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId: assignedTo,
        createdById: req.user.id,
      },
    });

    res.status(201).json({
      message: "Task created",
      task,
    });
  } catch (err) {
    next(err);
  }
};

// Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get single task
export const getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

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
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role === "USER" && task.assignedToId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const updated = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body,
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
    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};
