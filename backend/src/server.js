import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Built-in middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5001", credentials: true }));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
