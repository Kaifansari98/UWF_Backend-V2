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
const _sequelize = require("sequelize");
const _dotenv = /*#__PURE__*/ _interop_require_default(require("dotenv"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _process_env_DB_NAME, _process_env_DB_USERNAME, _process_env_DB_PASSWORD, _process_env_DB_HOST;
_dotenv.default.config();
const dbName = (_process_env_DB_NAME = process.env.DB_NAME) === null || _process_env_DB_NAME === void 0 ? void 0 : _process_env_DB_NAME.trim();
const dbUsername = (_process_env_DB_USERNAME = process.env.DB_USERNAME) === null || _process_env_DB_USERNAME === void 0 ? void 0 : _process_env_DB_USERNAME.trim();
const dbPassword = (_process_env_DB_PASSWORD = process.env.DB_PASSWORD) === null || _process_env_DB_PASSWORD === void 0 ? void 0 : _process_env_DB_PASSWORD.trim();
const dbHost = (_process_env_DB_HOST = process.env.DB_HOST) === null || _process_env_DB_HOST === void 0 ? void 0 : _process_env_DB_HOST.trim();
const sequelize = new _sequelize.Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false
});
const _default = sequelize;

//# sourceMappingURL=sequelize.js.map