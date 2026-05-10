import express from 'express';

import { createProject, deleteProjects, getAllProjects } from "../controllers/project.js";

const router= express.Router();

router.post('/createProject',createProject);
router.get('/getProjects',getAllProjects);
router.delete('/delete/:id',deleteProjects);
// router.delete('/deleteProjects',deleteProjects)

export default router;