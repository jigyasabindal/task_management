import express from "express";
import {
  createTask,
  deleteTask,
  find,
  updateTask,
  getAllTasks,
  getTasksByProject,
} from "../controllers/task.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/createTask", authenticate, requireRole("project_manager", "admin"), createTask);
router.get("/getAllTasks", authenticate, getAllTasks);
router.get("/find/:id", authenticate, find);
router.get("/byProject/:project_id", authenticate, getTasksByProject);
router.put("/updateTask/:id", authenticate, updateTask);
router.delete("/deleteTask/:id", authenticate, requireRole("project_manager", "admin"), deleteTask);

export default router;