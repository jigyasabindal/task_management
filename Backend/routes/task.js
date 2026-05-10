import express from 'express';

import { createTask, deleteTask, find, updateTask } from "../controllers/task.js";

const router=express.Router();

router.post('/createTask',createTask);
router.delete('/deleteTask/:id',deleteTask);
router.put('/updateTask/:id',updateTask);
router.get('/find/:id',find);

export default router;