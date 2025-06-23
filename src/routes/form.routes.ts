import { Router } from 'express';
import { createForm } from '../controllers/form.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate', authenticateToken, createForm);

export default router;