import { Router } from 'express';
import {
  generateNewStudentForm,
  generateFormForExistingStudent,
  getAllGeneratedForms,
  getFormStatus,
  getPendingForms,
  deletePendingFormById,
} from '../controllers/form.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/generate/new', authenticateToken, generateNewStudentForm);
router.post('/generate/existing', authenticateToken, generateFormForExistingStudent);
router.get('/all', authenticateToken, getAllGeneratedForms);
router.get('/status/:formId', getFormStatus);
router.get('/pending', authenticateToken, getPendingForms);
router.delete('/delete', authenticateToken, deletePendingFormById);

export default router;
