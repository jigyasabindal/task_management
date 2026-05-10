import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database.js";

dotenv.config();

// ── Import models (must be before sync) ──────────────────────────
import "./models/User.js";
import "./models/Project.js";
import "./models/Task.js";
import "./models/Comment.js";
import "./models/Notification.js";
import "./models/ActivityLog.js";

// ── Import routes ─────────────────────────────────────────────────
import userRoutes from "./routes/user.js";
import projectRoutes from "./routes/project.js";
import taskRoutes from "./routes/task.js";
import commentRoutes from "./routes/comment.js";
import notificationRoutes from "./routes/notification.js";
import activityLogRoutes from "./routes/activity_logs.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.use("/user", userRoutes);
app.use("/project", projectRoutes);
app.use("/task", taskRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notificationRoutes);
app.use("/activity", activityLogRoutes);

// ── Health check ──────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "TaskFlowSpirit API is running 🚀" }));

// ── Sync DB & Start Server ────────────────────────────────────────
const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err.message);
  });