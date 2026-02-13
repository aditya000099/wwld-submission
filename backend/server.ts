import express from "express";
import connectDb from "./db/db.ts";
import User from "./models/userModel.ts";
import Task from "./models/taskModel.ts";
import cors from "cors";
import authRoutes from "./routes/authRoute.ts";
import taskRoutes from "./routes/taskRoutes.ts";

const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

connectDb();

app.get("/health", (req: any, res: any) => {
  res.send("Working");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
  return "Working";
});
