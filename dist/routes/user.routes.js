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
const _usercontroller = require("../controllers/user.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const _uploadmiddleware = require("../middlewares/upload.middleware");
const router = (0, _express.Router)();
router.get('/me', _authmiddleware.authenticateToken, _usercontroller.getCurrentUser);
router.get('/', _authmiddleware.authenticateToken, _usercontroller.getAllUsers);
router.put('/:id', _authmiddleware.authenticateToken, _uploadmiddleware.uploadUserProfile.single("profile_pic"), _usercontroller.updateUser);
router.delete('/:id', _authmiddleware.authenticateToken, _usercontroller.deleteUser);
// POST /api/users/create
router.post('/create', _uploadmiddleware.uploadUserProfile.single('profile_pic'), _usercontroller.createUser);
const _default = router;

//# sourceMappingURL=user.routes.js.map