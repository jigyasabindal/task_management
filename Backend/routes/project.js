import express from "express";
import {
  createProject,
  deleteProjects,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/createProject", authenticate, requireRole("admin"), createProject);
router.get("/getProjects", authenticate, getAllProjects);
router.get("/getProject/:id", authenticate, getProjectById);
router.put("/update/:id", authenticate, requireRole("admin"), updateProject);
router.delete("/delete/:id", authenticate, requireRole("admin"), deleteProjects);

export default router;