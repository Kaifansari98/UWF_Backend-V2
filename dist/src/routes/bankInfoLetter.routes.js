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
const _bankInfoLettercontroller = require("../controllers/bankInfoLetter.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
router.post('/search', _authmiddleware.authenticateToken, _bankInfoLettercontroller.searchBankInfoLetters);
router.post('/', _authmiddleware.authenticateToken, _bankInfoLettercontroller.createBankInfoLetter);
router.delete('/:id', _authmiddleware.authenticateToken, _bankInfoLettercontroller.softDeleteBankInfoLetter);
const _default = router;

//# sourceMappingURL=bankInfoLetter.routes.js.map