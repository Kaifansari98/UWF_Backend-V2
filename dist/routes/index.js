"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const form_routes_1 = __importDefault(require("./form.routes"));
const formSubmission_routes_1 = __importDefault(require("./formSubmission.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const acknowledgement_routes_1 = __importDefault(require("./acknowledgement.routes"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/forms', form_routes_1.default);
router.use('/', formSubmission_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/acknowledgement', acknowledgement_routes_1.default);
router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is healthy' });
});
exports.default = router;
