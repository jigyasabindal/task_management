import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/comment.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id", authenticate, addComment);
router.get("/:id", authenticate, getComments);
router.delete("/delete/:id", authenticate, deleteComment);

export default router;