import express from 'express';
import { create } from "../controllers/Notification.js";

const router= express.Router();

router.get('/',create);

export default router;