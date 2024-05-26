import express from 'express';
import {  getUsers, postUser, deleteUser, getUserById  } from '../controllers/client.js';

const router = express.Router();

router.get("/get", getUsers);
router.get("/get/:id", getUserById);
router.post("/post/", postUser);
router.delete("/:id", deleteUser);


export default router;