import express from 'express';
import {  getUsers, postUser, deleteUser  } from '../controllers/client.js';

const router = express.Router();

router.get("/get", getUsers);
router.post("/post/", postUser);
router.delete("/:id", deleteUser);


export default router;