"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "authenticateToken", {
    enumerable: true,
    get: function() {
        return authenticateToken;
    }
});
const _jsonwebtoken = /*#__PURE__*/ _interop_require_default(require("jsonwebtoken"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
const authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        res.status(401).json({
            message: 'Access token missing'
        });
        return;
    }
    try {
        const decoded = _jsonwebtoken.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next(); // ✅ continue to next middleware
    } catch (err) {
        res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
};

//# sourceMappingURL=auth.middleware.js.map