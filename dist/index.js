"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const environment = (_a = process.env.ENVIRONMENT) === null || _a === void 0 ? void 0 : _a.trim().toUpperCase();
const PORT = environment === 'PRODUCTION' ? 5000 : 5001;
const allowedOrigins = new Set([
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
].filter((origin) => Boolean(origin)));
const corsOptions = {
    origin(origin, callback) {
        // Allow non-browser requests and local frontend origins.
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.options(/.*/, (0, cors_1.default)(corsOptions));
// Serve static files from the assets folder
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "../assets")));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.get('/', (_req, res) => {
    res.send('Welcome to UWF Backend V2 🚀');
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
