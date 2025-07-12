import { Router } from 'express';
import { 
    generateAcknowledgementForm, 
    uploadAcknowledgementInvoice, 
    getCompleteStudentData, 
    getAllPendingAcknowledgementForms, 
    getAllSubmittedAcknowledgementForms, 
    getAllAcceptedAcknowledgementForms, 
    markAcknowledgementFormAsAccepted, 
    revertAcknowledgementAcceptance  } from '../controllers/acknowledgement.controller';
import { uploadAcknowledgement } from '../middlewares/upload.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Create a new acknowledgment entry
router.post('/generate', generateAcknowledgementForm);

router.put('/upload/:formId', uploadAcknowledgement.single('invoice'), uploadAcknowledgementInvoice);

router.get('/details/:formId', getCompleteStudentData);

router.get('/pending', getAllPendingAcknowledgementForms);
router.get('/submitted', getAllSubmittedAcknowledgementForms);
router.get('/accepted', getAllAcceptedAcknowledgementForms);

router.put('/accept/:formId', authenticateToken, markAcknowledgementFormAsAccepted);
router.put('/revert-accept/:formId', authenticateToken, revertAcknowledgementAcceptance);

export default router;