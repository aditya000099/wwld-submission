import express from "express";
import taskController from "../controllers/taskController.ts";

const router = express.Router();

// Authentication routes
router.post("/create", taskController.createTask);
router.post("/get", taskController.getTask);

export default router;
