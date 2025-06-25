import { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getCurrentUser, updateUser } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { uploadUserProfile } from '../middlewares/upload.middleware';

const router = Router();

router.get('/me', authenticateToken, getCurrentUser);
router.get('/', authenticateToken, getAllUsers);
router.put('/:id', authenticateToken, uploadUserProfile.single("profile_pic"), updateUser);
router.delete('/:id', authenticateToken, deleteUser);
// POST /api/users/create
router.post('/create', uploadUserProfile.single('profile_pic'), createUser);

export default router;
