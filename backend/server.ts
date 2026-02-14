import express from "express";
import connectDb from "./db/db.ts";
import cors from "cors";
import authRoutes from "./routes/authRoute.ts";
import taskRoutes from "./routes/taskRoutes.ts";
import { connectRedis } from "./utils/redis.ts";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});



connectDb();
connectRedis();

app.get("/health", (req, res) => {
  res.send("Working");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

let PORT = 3000;
app.listen(PORT, () => {
  console.log("App listening on port ", PORT);
});
