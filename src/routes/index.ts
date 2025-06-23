import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import formRoutes from './form.routes';
import formSubmissionRoutes from './formSubmission.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/forms', formRoutes);
router.use('/', formSubmissionRoutes);

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

export default router;
