import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authRoutes from "../routes/authRoute.ts";
import connectDb from "../db/db.ts";
import User from "../models/userModel.ts";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
    describe("POST /api/auth/signup", () => {
        it("should create a new user", async () => {
            const res = await request(app).post("/api/auth/signup").send({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty("token");
            expect(res.body).toHaveProperty("user");
            expect(res.body.user).toHaveProperty("email", "test@example.com");
        });

        it("should not create user with existing email", async () => {

            await User.create({
                name: "Existing User",
                email: "existing@example.com",
                password: "password123",
            });

            const res = await request(app).post("/api/auth/signup").send({
                name: "New User",
                email: "existing@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body).toHaveProperty("error", "Email already registered");
        });

        it("should validate required fields", async () => {
            const res = await request(app).post("/api/auth/signup").send({
                email: "test@example.com",
                password: "password123"
            });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await User.create({
                name: "Login User",
                email: "login@example.com",
                password: "password123"
            });
        });

        it("should login with correct credentials", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("token");
            expect(res.body.user).toHaveProperty("email", "login@example.com");
        });

        it("should not login with incorrect password", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login@example.com",
                password: "wrongpassword",
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error", "Invalid credentials");
        });

        it("should not login with non-existent user", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "nonexistent@example.com",
                password: "password123",
            });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("error", "Invalid credentials");
        });
    });
});
