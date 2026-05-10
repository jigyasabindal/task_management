import express from "express";
import {
  register,
  publicRegister,
  deleteUser,
  updateUser,
  getAllUsers,
  login,
  find,
} from "../controllers/authController.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = express.Router();

// ── Public (no auth needed) ───────────────────────────────────────
router.post("/login", login);
router.post("/register", publicRegister);       // self-signup → always "member" role

// ── Admin: create user with any role ─────────────────────────────
router.post("/createUser", authenticate, requireRole("admin"), register);

// ── Protected ─────────────────────────────────────────────────────
router.get("/getUsers", authenticate, getAllUsers);
router.get("/find/:id", authenticate, find);
router.put("/updateUser/:id", authenticate, updateUser);
router.delete("/deleteUser/:id", authenticate, requireRole("admin"), deleteUser);

export default router;