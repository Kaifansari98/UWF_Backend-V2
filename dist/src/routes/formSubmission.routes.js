"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _express = require("express");
const _formSubmissioncontroller = require("../controllers/formSubmission.controller");
const _uploadmiddleware = require("../middlewares/upload.middleware");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
router.post('/submit/:formId', _uploadmiddleware.uploadFormData.fields([
    {
        name: 'feesStructure',
        maxCount: 1
    },
    {
        name: 'marksheet',
        maxCount: 1
    },
    {
        name: 'signature',
        maxCount: 1
    },
    {
        name: 'parentApprovalLetter',
        maxCount: 1
    }
]), _formSubmissioncontroller.submitForm);
router.put('/submissions/edit/:formId', _authmiddleware.authenticateToken, _uploadmiddleware.uploadFormData.fields([
    {
        name: 'feesStructure',
        maxCount: 1
    },
    {
        name: 'marksheet',
        maxCount: 1
    },
    {
        name: 'signature',
        maxCount: 1
    },
    {
        name: 'parentApprovalLetter',
        maxCount: 1
    }
]), _formSubmissioncontroller.editFormSubmission);
router.get('/submissions/submitted', _authmiddleware.authenticateToken, _formSubmissioncontroller.getSubmittedFormSubmissions);
router.delete('/submissions/delete', _authmiddleware.authenticateToken, _formSubmissioncontroller.deleteFormSubmission);
router.put('/submissions/reject/:formId', _authmiddleware.authenticateToken, _formSubmissioncontroller.rejectFormSubmission);
router.put('/submissions/revert-rejection/:formId', _authmiddleware.authenticateToken, _formSubmissioncontroller.revertRejection);
router.get('/submissions/rejected', _authmiddleware.authenticateToken, _formSubmissioncontroller.getRejectedFormSubmissions);
router.put("/submissions/accept/:formId", _authmiddleware.authenticateToken, _formSubmissioncontroller.acceptFormSubmission);
router.put("/submissions/revert-accept/:formId", _authmiddleware.authenticateToken, _formSubmissioncontroller.revertFormAcceptance);
router.get("/submissions/accepted", _authmiddleware.authenticateToken, _formSubmissioncontroller.getAcceptedFormSubmissions);
router.put("/submissions/accept/amount/:formId", _authmiddleware.authenticateToken, _formSubmissioncontroller.updateAcceptedAmount);
router.get("/submissions/payment-in-progress", _authmiddleware.authenticateToken, _formSubmissioncontroller.getPaymentInProgressForms);
router.put("/submissions/revert-treasury/:formId", _authmiddleware.authenticateToken, _formSubmissioncontroller.revertTreasuryApproval);
router.put("/submissions/disburse/:formId", _formSubmissioncontroller.markFormAsDisbursed);
router.put("/submissions/revert-disbursement/:formId", _formSubmissioncontroller.revertDisbursedForm);
router.get("/submissions/disbursed", _formSubmissioncontroller.getDisbursedForms);
router.put("/submissions/disburseARequest/:formId", _formSubmissioncontroller.markRequestAsDisbursed);
router.put("/submissions/revertDisbursementStatus/:formId", _formSubmissioncontroller.revertDisbursementToAccepted);
router.get("/submissions/disbursed/all", _authmiddleware.authenticateToken, _formSubmissioncontroller.getAllDisbursedData);
router.get("/submissions/new-students", _authmiddleware.authenticateToken, _formSubmissioncontroller.getAllNewStudentSubmissions);
router.put("/submissions/close-case/:formId", _authmiddleware.authenticateToken, _formSubmissioncontroller.markFormAsCaseClosed);
router.get("/submissions/case-closed", _authmiddleware.authenticateToken, _formSubmissioncontroller.getCaseClosedForms);
router.get("/submissions/case-closed/current-year", _authmiddleware.authenticateToken, _formSubmissioncontroller.getCaseClosedFormsCurrentYear);
router.put("/submissions/revert-case-closed/:formId", _formSubmissioncontroller.revertCaseClosed);
const _default = router;

//# sourceMappingURL=formSubmission.routes.js.map