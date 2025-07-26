"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // ✅ import cors
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ✅ Allow CORS from frontend
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
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
