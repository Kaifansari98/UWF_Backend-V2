"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const acknowledgement_controller_1 = require("../controllers/acknowledgement.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create a new acknowledgment entry
router.post('/generate', acknowledgement_controller_1.generateAcknowledgementForm);
router.put('/upload/:formId', upload_middleware_1.uploadAcknowledgement.single('invoice'), acknowledgement_controller_1.uploadAcknowledgementInvoice);
router.get('/details/:formId', acknowledgement_controller_1.getCompleteStudentData);
router.get('/pending', acknowledgement_controller_1.getAllPendingAcknowledgementForms);
router.get('/submitted', acknowledgement_controller_1.getAllSubmittedAcknowledgementForms);
router.get('/accepted', acknowledgement_controller_1.getAllAcceptedAcknowledgementForms);
router.put('/accept/:formId', auth_middleware_1.authenticateToken, acknowledgement_controller_1.markAcknowledgementFormAsAccepted);
router.put('/revert-accept/:formId', auth_middleware_1.authenticateToken, acknowledgement_controller_1.revertAcknowledgementAcceptance);
exports.default = router;
