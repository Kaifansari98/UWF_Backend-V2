import { Router } from 'express';
import { submitForm, getSubmittedFormSubmissions } from '../controllers/formSubmission.controller';
import { uploadFormData } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post(
    '/submit/:formId',
    uploadFormData.fields([
      { name: 'feesStructure', maxCount: 1 },
      { name: 'marksheet', maxCount: 1 },
      { name: 'signature', maxCount: 1 }
    ]),
    submitForm
);

router.get('/submissions/submitted', authenticateToken, getSubmittedFormSubmissions);

export default router;
