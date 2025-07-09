import { Router } from 'express';
import { 
  submitForm,
  getSubmittedFormSubmissions, 
  deleteFormSubmission, 
  editFormSubmission, 
  rejectFormSubmission, 
  revertRejection, 
  getRejectedFormSubmissions, 
  acceptFormSubmission,
  revertFormAcceptance, 
  getAcceptedFormSubmissions,
  updateAcceptedAmount,
  getPaymentInProgressForms,
  revertTreasuryApproval,
  markFormAsDisbursed,
  revertDisbursedForm,
  getDisbursedForms,
  markRequestAsDisbursed,
  revertDisbursementToAccepted,
  getAllDisbursedData,
  getAllNewStudentSubmissions,
  markFormAsCaseClosed,
  getCaseClosedForms,
  revertCaseClosed,
  getCaseClosedFormsCurrentYear
} from '../controllers/formSubmission.controller';
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

router.put("/submissions/accept/:formId", authenticateToken, acceptFormSubmission);
router.put("/submissions/revert-accept/:formId", authenticateToken, revertFormAcceptance);
router.get("/submissions/accepted", authenticateToken, getAcceptedFormSubmissions);

router.put(
  "/submissions/accept/amount/:formId",
  authenticateToken,
  updateAcceptedAmount
);

router.get("/submissions/payment-in-progress", authenticateToken, getPaymentInProgressForms);
router.put("/submissions/revert-treasury/:formId", authenticateToken, revertTreasuryApproval);

router.put("/submissions/disburse/:formId", markFormAsDisbursed);
router.put("/submissions/revert-disbursement/:formId", revertDisbursedForm);

router.get("/submissions/disbursed", getDisbursedForms);
router.put("/submissions/disburseARequest/:formId", markRequestAsDisbursed);
router.put("/submissions/revertDisbursementStatus/:formId", revertDisbursementToAccepted);
router.get("/submissions/disbursed/all", authenticateToken, getAllDisbursedData);

router.get("/submissions/new-students", authenticateToken, getAllNewStudentSubmissions);

router.put("/submissions/close-case/:formId", authenticateToken, markFormAsCaseClosed);
router.get("/submissions/case-closed", authenticateToken, getCaseClosedForms);
router.get("/submissions/case-closed/current-year", authenticateToken, getCaseClosedFormsCurrentYear);
router.put("/submissions/revert-case-closed/:formId", revertCaseClosed);

export default router;