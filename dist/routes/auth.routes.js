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
const _authcontroller = require("../controllers/auth.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
router.post('/login', _authcontroller.login);
router.post('/change-password', _authmiddleware.authenticateToken, _authcontroller.changePassword);
const _default = router;

//# sourceMappingURL=auth.routes.js.map