import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getOverdueAlerts,
} from "../controllers/Notification.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, getMyNotifications);
router.get("/overdue", authenticate, getOverdueAlerts);
router.put("/read/:id", authenticate, markAsRead);
router.put("/readAll", authenticate, markAllAsRead);

export default router;