"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankInfoLetter_controller_1 = require("../controllers/bankInfoLetter.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/search', auth_middleware_1.authenticateToken, bankInfoLetter_controller_1.searchBankInfoLetters);
router.post('/', auth_middleware_1.authenticateToken, bankInfoLetter_controller_1.createBankInfoLetter);
exports.default = router;
