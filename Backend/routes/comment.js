import express from 'express';
import { comments } from "../controllers/comment.js";

const router= express.Router();

router.post('/:id',comments);

export default router;