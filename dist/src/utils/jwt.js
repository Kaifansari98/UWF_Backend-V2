"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generateToken", {
    enumerable: true,
    get: function() {
        return generateToken;
    }
});
const _jsonwebtoken = /*#__PURE__*/ _interop_require_default(require("jsonwebtoken"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key'; // fallback to avoid undefined
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (payload)=>{
    const options = {
        expiresIn: JWT_EXPIRES_IN
    };
    return _jsonwebtoken.default.sign(payload, JWT_SECRET, options);
};

//# sourceMappingURL=jwt.js.map