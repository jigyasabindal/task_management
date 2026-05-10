import express from 'express';

import { register, deleteUser, updateUser, getAllUsers, login, find } from "../controllers/authController.js";

const router= express.Router();

router.post('/register',register);
router.delete('/deleteUser/:id',deleteUser);
router.put('/updateUser/:id',updateUser);
router.get('/getUsers',getAllUsers);
router.get('/login',login);
router.get('/find/:id',find);

export default router;