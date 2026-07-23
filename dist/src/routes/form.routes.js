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
const _formcontroller = require("../controllers/form.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
router.post('/generate/new', _authmiddleware.authenticateToken, _formcontroller.generateNewStudentForm);
router.post('/generate/existing', _authmiddleware.authenticateToken, _formcontroller.generateFormForExistingStudent);
router.post('/check-duplicate', _authmiddleware.authenticateToken, _formcontroller.checkDuplicateStudent);
router.get('/all', _authmiddleware.authenticateToken, _formcontroller.getAllGeneratedForms);
router.get('/status/:formId', _formcontroller.getFormStatus);
router.get('/pending', _authmiddleware.authenticateToken, _formcontroller.getPendingForms);
router.delete('/delete', _authmiddleware.authenticateToken, _formcontroller.deletePendingFormById);
const _default = router;

//# sourceMappingURL=form.routes.js.map