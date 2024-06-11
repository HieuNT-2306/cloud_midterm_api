import express from 'express';
import {  getUsers, postUser, deleteUser, getUserById  } from '../controllers/client.js';
import { authenticateToken, authorizeRoles } from '../helper/auth.js'; 

const router = express.Router();

//router.get("/get",authenticateToken, authorizeRoles('admin', 'user'), getUsers);
router.get("/get", getUsers);
router.get("/get/:id", authenticateToken, authorizeRoles('admin', 'user'),  getUserById);
router.post("/post/", authenticateToken, authorizeRoles('admin'), postUser);
router.delete("/:id", authenticateToken, authorizeRoles('admin'), deleteUser);


export default router;