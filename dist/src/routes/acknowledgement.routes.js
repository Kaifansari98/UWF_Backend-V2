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
const _acknowledgementcontroller = require("../controllers/acknowledgement.controller");
const _uploadmiddleware = require("../middlewares/upload.middleware");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
// Create a new acknowledgment entry
router.post('/generate', _acknowledgementcontroller.generateAcknowledgementForm);
router.put('/upload/:formId', _uploadmiddleware.uploadAcknowledgement.single('invoice'), _acknowledgementcontroller.uploadAcknowledgementInvoice);
router.get('/details/:formId', _acknowledgementcontroller.getCompleteStudentData);
router.get('/pending', _acknowledgementcontroller.getAllPendingAcknowledgementForms);
router.get('/submitted', _acknowledgementcontroller.getAllSubmittedAcknowledgementForms);
router.get('/accepted', _acknowledgementcontroller.getAllAcceptedAcknowledgementForms);
router.put('/accept/:formId', _authmiddleware.authenticateToken, _acknowledgementcontroller.markAcknowledgementFormAsAccepted);
router.put('/revert-accept/:formId', _authmiddleware.authenticateToken, _acknowledgementcontroller.revertAcknowledgementAcceptance);
router.delete('/pending/:formId', _authmiddleware.authenticateToken, _acknowledgementcontroller.deletePendingAcknowledgementForm);
const _default = router;

//# sourceMappingURL=acknowledgement.routes.js.map