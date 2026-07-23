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
const _authroutes = /*#__PURE__*/ _interop_require_default(require("./auth.routes"));
const _userroutes = /*#__PURE__*/ _interop_require_default(require("./user.routes"));
const _formroutes = /*#__PURE__*/ _interop_require_default(require("./form.routes"));
const _formSubmissionroutes = /*#__PURE__*/ _interop_require_default(require("./formSubmission.routes"));
const _dashboardroutes = /*#__PURE__*/ _interop_require_default(require("./dashboard.routes"));
const _acknowledgementroutes = /*#__PURE__*/ _interop_require_default(require("./acknowledgement.routes"));
const _bankInfoLetterroutes = /*#__PURE__*/ _interop_require_default(require("./bankInfoLetter.routes"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const router = (0, _express.Router)();
router.use('/auth', _authroutes.default);
router.use('/users', _userroutes.default);
router.use('/forms', _formroutes.default);
router.use('/', _formSubmissionroutes.default);
router.use('/dashboard', _dashboardroutes.default);
router.use('/acknowledgement', _acknowledgementroutes.default);
router.use('/bank-info-letters', _bankInfoLetterroutes.default);
router.get('/health', (_req, res)=>{
    res.status(200).json({
        status: 'OK',
        message: 'API is healthy'
    });
});
const _default = router;

//# sourceMappingURL=index.js.map