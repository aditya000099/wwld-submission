import express from "express";
import authController from "../controllers/authController.ts";

const router = express.Router();

// Authentication routes
router.post("/signup", authController.register);
router.post("/login", authController.login);

export default router;
