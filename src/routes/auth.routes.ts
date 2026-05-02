import { Router } from 'express';
import { login, changePassword } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/change-password', authenticateToken, changePassword);

export default router;
