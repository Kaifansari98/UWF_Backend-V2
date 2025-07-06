import { Router } from 'express';
import { submitForm, getSubmittedFormSubmissions, deleteFormSubmission, editFormSubmission, rejectFormSubmission, revertRejection, getRejectedFormSubmissions } from '../controllers/formSubmission.controller';
import { uploadFormData } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post(
    '/submit/:formId',
    uploadFormData.fields([
      { name: 'feesStructure', maxCount: 1 },
      { name: 'marksheet', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
      { name: 'parentApprovalLetter', maxCount: 1 },
    ]), 
    submitForm
);

router.put(
  '/submissions/edit/:formId',
  authenticateToken,
  uploadFormData.fields([
    { name: 'feesStructure', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'parentApprovalLetter', maxCount: 1 },
  ]),
  editFormSubmission
);

router.get('/submissions/submitted', authenticateToken, getSubmittedFormSubmissions);

router.delete('/submissions/delete', authenticateToken, deleteFormSubmission);

router.put(
  '/submissions/reject/:formId',
  authenticateToken,
  rejectFormSubmission
); 

router.put(
  '/submissions/revert-rejection/:formId',
  authenticateToken,
  revertRejection
);

router.get(
  '/submissions/rejected',
  authenticateToken,
  getRejectedFormSubmissions
);

export default router;