import express from 'express';
import { login, set } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/set/:id', set);

export default router;
