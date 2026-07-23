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
const _dashboardcontroller = require("../controllers/dashboard.controller");
const _authmiddleware = require("../middlewares/auth.middleware");
const router = (0, _express.Router)();
router.get('/stats', _dashboardcontroller.getDashboardStats, _authmiddleware.authenticateToken);
const _default = router;

//# sourceMappingURL=dashboard.routes.js.map