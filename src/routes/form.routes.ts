import { Router } from 'express';
import {
  generateNewStudentForm,
  generateFormForExistingStudent,
  getAllGeneratedForms
} from '../controllers/form.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate/new', authenticateToken, generateNewStudentForm);
router.post('/generate/existing', authenticateToken, generateFormForExistingStudent);
router.get('/all', authenticateToken, getAllGeneratedForms);

export default router;
