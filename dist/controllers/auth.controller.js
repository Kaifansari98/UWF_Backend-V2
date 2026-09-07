"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.login = void 0;
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jwt_1 = require("../utils/jwt");
const isMasterPassword = (candidate) => {
    var _a;
    const masterPassword = (_a = process.env.MASTER_PASSWORD) === null || _a === void 0 ? void 0 : _a.trim();
    if (!masterPassword || !candidate)
        return false;
    const candidateBuf = Buffer.from(candidate);
    const masterBuf = Buffer.from(masterPassword);
    if (candidateBuf.length !== masterBuf.length)
        return false;
    return crypto_1.default.timingSafeEqual(candidateBuf, masterBuf);
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_model_1.default.findOne({ where: { username } });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const usedMasterPassword = isMasterPassword(password);
    const isMatch = usedMasterPassword || (yield bcrypt_1.default.compare(password, user.password));
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    if (usedMasterPassword) {
        console.warn(`[MASTER_PASSWORD LOGIN] username="${user.username}" role="${user.role}" at ${new Date().toISOString()}`);
    }
    const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role, full_name: user.full_name });
    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name,
            email: user.email,
            profile_pic: user.profile_pic
        }
    });
});
exports.login = login;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { current_password, new_password } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!current_password || !new_password) {
        res.status(400).json({ message: 'Current password and new password are required' });
        return;
    }
    if (new_password.length < 8) {
        res.status(400).json({ message: 'New password must be at least 8 characters' });
        return;
    }
    const user = yield user_model_1.default.findByPk(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    const isMatch = yield bcrypt_1.default.compare(current_password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
    }
    // User model hooks already hash password changes before update.
    yield user.update({ password: new_password });
    res.status(200).json({ message: 'Password changed successfully' });
});
exports.changePassword = changePassword;
