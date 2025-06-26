import { Router } from 'express';
import { submitForm } from '../controllers/formSubmission.controller';
import { uploadFormData } from '../middlewares/upload.middleware';

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

export default router;
