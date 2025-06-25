import { Router } from 'express';
import { createUser, getAllUsers, getCurrentUser, updateUser } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadUserProfile } from '../middlewares/upload.middleware';

const router = Router();

router.get('/me', authenticateToken, getCurrentUser);
router.get('/', authenticateToken, getAllUsers);
router.put('/:id', authenticateToken, updateUser);
// POST /api/users/create
router.post('/create', uploadUserProfile.single('profile_pic'), createUser);


export default router;
