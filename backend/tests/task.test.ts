
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

import request from "supertest";
import express from "express";
import taskRoutes from "../routes/taskRoutes";
import authRoutes from "../routes/authRoute";
import { protect } from "../middleware/authMiddleware";
import Task from "../models/taskModel";
import User from "../models/userModel";


const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", protect, taskRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", protect, taskRoutes);

describe("Task Routes", () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {

        const userRes = await request(app).post("/api/auth/signup").send({
            name: "Task User",
            email: "task@example.com",
            password: "password123",
        });
        token = userRes.body.token;
        userId = userRes.body.user.id;
    });

    describe("POST /api/tasks", () => {
        it("should create a new task", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            const res = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "New Task",
                    description: "Task Description",
                    dueDate: futureDate.toISOString(),
                    status: "pending",
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("title", "New Task");
            expect(res.body).toHaveProperty("owner", userId);
        });

        it("should fail without token", async () => {
            const res = await request(app).post("/api/tasks").send({
                title: "New Task",
            });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe("GET /api/tasks", () => {
        it("should get user tasks", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            // Create a task first
            await Task.create({
                title: "Existing Task",
                description: "Desc",
                dueDate: futureDate,
                owner: userId,
            });

            const res = await request(app)
                .get("/api/tasks")
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe("Existing Task");
        });
    });

    describe("PUT /api/tasks/:id", () => {
        it("should update a task", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            const task = await Task.create({
                title: "Old Title",
                description: "Desc",
                dueDate: futureDate,
                owner: userId,
            });

            const res = await request(app)
                .put(`/api/tasks/${task._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "New Title"
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toBe("New Title");
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        it("should delete a task", async () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);

            const task = await Task.create({
                title: "To Delete",
                description: "Desc",
                dueDate: futureDate,
                owner: userId,
            });

            const res = await request(app)
                .delete(`/api/tasks/${task._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);

            const found = await Task.findById(task._id);
            expect(found).toBeNull();
        });
    });
});
