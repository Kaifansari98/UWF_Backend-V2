"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formSubmission_controller_1 = require("../controllers/formSubmission.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/submit/:formId', upload_middleware_1.uploadFormData.fields([
    { name: 'feesStructure', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'parentApprovalLetter', maxCount: 1 },
]), formSubmission_controller_1.submitForm);
router.put('/submissions/edit/:formId', auth_middleware_1.authenticateToken, upload_middleware_1.uploadFormData.fields([
    { name: 'feesStructure', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'parentApprovalLetter', maxCount: 1 },
]), formSubmission_controller_1.editFormSubmission);
router.get('/submissions/submitted', auth_middleware_1.authenticateToken, formSubmission_controller_1.getSubmittedFormSubmissions);
router.delete('/submissions/delete', auth_middleware_1.authenticateToken, formSubmission_controller_1.deleteFormSubmission);
router.put('/submissions/reject/:formId', auth_middleware_1.authenticateToken, formSubmission_controller_1.rejectFormSubmission);
router.put('/submissions/revert-rejection/:formId', auth_middleware_1.authenticateToken, formSubmission_controller_1.revertRejection);
router.get('/submissions/rejected', auth_middleware_1.authenticateToken, formSubmission_controller_1.getRejectedFormSubmissions);
router.put("/submissions/accept/:formId", auth_middleware_1.authenticateToken, formSubmission_controller_1.acceptFormSubmission);
router.put("/submissions/revert-accept/:formId", auth_middleware_1.authenticateToken, formSubmission_controller_1.revertFormAcceptance);
router.get("/submissions/accepted", auth_middleware_1.authenticateToken, formSubmission_controller_1.getAcceptedFormSubmissions);
router.put("/submissions/accept/amount/:formId", auth_middleware_1.authenticateToken, formSubmission_controller_1.updateAcceptedAmount);
router.get("/submissions/payment-in-progress", auth_middleware_1.authenticateToken, formSubmission_controller_1.getPaymentInProgressForms);
router.put("/submissions/revert-treasury/:formId", auth_middleware_1.authenticateToken, formSubmission_controller_1.revertTreasuryApproval);
router.put("/submissions/disburse/:formId", formSubmission_controller_1.markFormAsDisbursed);
router.put("/submissions/revert-disbursement/:formId", formSubmission_controller_1.revertDisbursedForm);
router.get("/submissions/disbursed", formSubmission_controller_1.getDisbursedForms);
router.put("/submissions/disburseARequest/:formId", formSubmission_controller_1.markRequestAsDisbursed);
router.put("/submissions/revertDisbursementStatus/:formId", formSubmission_controller_1.revertDisbursementToAccepted);
router.get("/submissions/disbursed/all", auth_middleware_1.authenticateToken, formSubmission_controller_1.getAllDisbursedData);
router.get("/submissions/new-students", auth_middleware_1.authenticateToken, formSubmission_controller_1.getAllNewStudentSubmissions);
router.put("/submissions/close-case/:formId", auth_middleware_1.authenticateToken, formSubmission_controller_1.markFormAsCaseClosed);
router.get("/submissions/case-closed", auth_middleware_1.authenticateToken, formSubmission_controller_1.getCaseClosedForms);
router.get("/submissions/case-closed/current-year", auth_middleware_1.authenticateToken, formSubmission_controller_1.getCaseClosedFormsCurrentYear);
router.put("/submissions/revert-case-closed/:formId", formSubmission_controller_1.revertCaseClosed);
exports.default = router;
