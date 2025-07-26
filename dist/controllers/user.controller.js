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
exports.deleteUser = exports.updateUser = exports.getAllUsers = exports.createUser = exports.getCurrentUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const API_URL = process.env.API_URL || "http://localhost:5000";
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const user = yield user_model_1.default.findByPk(userId, {
            attributes: ['id', 'username', 'email', 'role', 'full_name', 'profile_pic'] // ✅ added
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching user info' });
    }
});
exports.getCurrentUser = getCurrentUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = `${req.protocol}://${req.get("host")}`; // http://localhost:5000
    try {
        const { username, full_name, password, role, email, age, country, state, city, pincode, mobile_no } = req.body;
        const profile_pic = req.file ? `${API_URL}/assets/UserData/${req.file.originalname}` : null;
        // const hashedPassword = await bcrypt.hash(password, 10);
        const user = yield user_model_1.default.create({
            username,
            full_name,
            password,
            role,
            email,
            age,
            country,
            state,
            city,
            pincode,
            mobile_no,
            profile_pic
        });
        res.status(201).json({ message: 'User created', user });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create user', error });
    }
});
exports.createUser = createUser;
const getAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.findAll();
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err });
    }
});
exports.getAllUsers = getAllUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    try {
        const { id } = req.params;
        const { username, full_name, password, role, email, age, country, state, city, pincode, mobile_no } = req.body;
        const user = yield user_model_1.default.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Handle profile_pic if uploaded
        const profile_pic = req.file
            ? `${API_URL}/assets/UserData/${req.file.originalname}`
            : user.profile_pic;
        const updateData = {
            username,
            full_name,
            role,
            email,
            age,
            country,
            state,
            city,
            pincode,
            mobile_no,
            profile_pic
        };
        if (password) {
            updateData.password = password;
        }
        yield user.update(updateData);
        res.status(200).json({
            message: 'User updated successfully',
            user: Object.assign(Object.assign({}, user.toJSON()), { profile_pic: user.profile_pic ? `${baseUrl}${user.profile_pic}` : null })
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield user_model_1.default.findByPk(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Delete the profile picture if it exists
        if (user.profile_pic) {
            const imagePath = path_1.default.join(__dirname, '../../', user.profile_pic);
            if (fs_1.default.existsSync(imagePath)) {
                fs_1.default.unlinkSync(imagePath);
            }
        }
        yield user.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to delete user', error: err });
    }
});
exports.deleteUser = deleteUser;
