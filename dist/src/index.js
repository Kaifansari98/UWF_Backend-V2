"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _express = /*#__PURE__*/ _interop_require_default(require("express"));
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
const _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
const _routes = /*#__PURE__*/ _interop_require_default(require("./routes"));
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _process_env_ENVIRONMENT, _process_env_FRONTEND_URL;
_dotenv.default.config();
const app = (0, _express.default)();
const environment = (_process_env_ENVIRONMENT = process.env.ENVIRONMENT) === null || _process_env_ENVIRONMENT === void 0 ? void 0 : _process_env_ENVIRONMENT.trim().toUpperCase();
const PORT = environment === 'PRODUCTION' ? 5000 : 5001;
const frontendUrl = (_process_env_FRONTEND_URL = process.env.FRONTEND_URL) === null || _process_env_FRONTEND_URL === void 0 ? void 0 : _process_env_FRONTEND_URL.trim();
const localFrontendUrls = (process.env.LOCAL_FRONTEND_URLS || '').split(',').map((origin)=>origin.trim()).filter(Boolean);
const allowedOrigins = new Set([
    frontendUrl,
    ...localFrontendUrls
].filter((origin)=>Boolean(origin)));
const corsOptions = {
    origin (origin, callback) {
        // Allow non-browser requests and local frontend origins.
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
};
app.use((0, _cors.default)(corsOptions));
app.options(/.*/, (0, _cors.default)(corsOptions));
// Serve static files from the assets folder
app.use("/assets", _express.default.static(_path.default.join(__dirname, "../assets")));
app.use(_express.default.json());
app.use('/api', _routes.default);
app.get('/', (_req, res)=>{
    res.send('Welcome to UWF Backend V2 🚀');
});
app.listen(PORT, ()=>{
    console.log(`Server running at ${process.env.API_URL || `http://localhost:${PORT}`}`);
});

//# sourceMappingURL=index.js.map