import express from "express";
import { getAllLogs, getMyLogs, getLogsByUser } from "../controllers/activityLog.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, requireRole("admin"), getAllLogs);
router.get("/mine", authenticate, getMyLogs);
router.get("/user/:id", authenticate, requireRole("admin"), getLogsByUser);

export default router;