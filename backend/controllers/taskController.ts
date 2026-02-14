import type { Request, Response } from "express";
import Task from "../models/taskModel.ts";
import { getCache, setCache, deleteCache } from "../utils/redis.ts";

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const cacheKey = `tasks:${userId}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const tasks = await Task.find({ owner: userId })
      .sort({ dueDate: 1 })
      .lean();

    await setCache(cacheKey, tasks, 300);

    return res.json(tasks);
  } catch {
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { title, description, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ error: "Title and due date required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      owner: userId,
    });

    await deleteCache(`tasks:${userId}`);

    return res.status(201).json(task);
  } catch {
    return res.status(500).json({ error: "Failed to create task" });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, owner: userId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    await deleteCache(`tasks:${userId}`);

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      owner: userId,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await deleteCache(`tasks:${userId}`);

    return res.json({ message: "Task deleted" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete task" });
  }
};

export default { createTask, getTasks, deleteTask, updateTask };
