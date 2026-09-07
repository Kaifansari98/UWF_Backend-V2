"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = (_a = process.env.DB_NAME) === null || _a === void 0 ? void 0 : _a.trim();
const dbUsername = (_b = process.env.DB_USERNAME) === null || _b === void 0 ? void 0 : _b.trim();
const dbPassword = (_c = process.env.DB_PASSWORD) === null || _c === void 0 ? void 0 : _c.trim();
const dbHost = (_d = process.env.DB_HOST) === null || _d === void 0 ? void 0 : _d.trim();
const sequelize = new sequelize_1.Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false
});
exports.default = sequelize;
