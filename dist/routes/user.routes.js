"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.authenticateToken, user_controller_1.getCurrentUser);
router.get('/', auth_middleware_1.authenticateToken, user_controller_1.getAllUsers);
router.put('/:id', auth_middleware_1.authenticateToken, upload_middleware_1.uploadUserProfile.single("profile_pic"), user_controller_1.updateUser);
router.delete('/:id', auth_middleware_1.authenticateToken, user_controller_1.deleteUser);
// POST /api/users/create
router.post('/create', upload_middleware_1.uploadUserProfile.single('profile_pic'), user_controller_1.createUser);
exports.default = router;
