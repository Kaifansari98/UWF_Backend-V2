"use strict";
var _process_env_DB_USERNAME, _process_env_DB_PASSWORD, _process_env_DB_NAME, _process_env_DB_HOST, _process_env_DB_USERNAME1, _process_env_DB_PASSWORD1, _process_env_DB_NAME1, _process_env_DB_HOST1;
require('dotenv').config();
module.exports = {
    development: {
        username: (_process_env_DB_USERNAME = process.env.DB_USERNAME) === null || _process_env_DB_USERNAME === void 0 ? void 0 : _process_env_DB_USERNAME.trim(),
        password: (_process_env_DB_PASSWORD = process.env.DB_PASSWORD) === null || _process_env_DB_PASSWORD === void 0 ? void 0 : _process_env_DB_PASSWORD.trim(),
        database: (_process_env_DB_NAME = process.env.DB_NAME) === null || _process_env_DB_NAME === void 0 ? void 0 : _process_env_DB_NAME.trim(),
        host: (_process_env_DB_HOST = process.env.DB_HOST) === null || _process_env_DB_HOST === void 0 ? void 0 : _process_env_DB_HOST.trim(),
        port: +process.env.DB_PORT,
        dialect: 'postgres'
    },
    production: {
        username: (_process_env_DB_USERNAME1 = process.env.DB_USERNAME) === null || _process_env_DB_USERNAME1 === void 0 ? void 0 : _process_env_DB_USERNAME1.trim(),
        password: (_process_env_DB_PASSWORD1 = process.env.DB_PASSWORD) === null || _process_env_DB_PASSWORD1 === void 0 ? void 0 : _process_env_DB_PASSWORD1.trim(),
        database: (_process_env_DB_NAME1 = process.env.DB_NAME) === null || _process_env_DB_NAME1 === void 0 ? void 0 : _process_env_DB_NAME1.trim(),
        host: (_process_env_DB_HOST1 = process.env.DB_HOST) === null || _process_env_DB_HOST1 === void 0 ? void 0 : _process_env_DB_HOST1.trim(),
        port: +process.env.DB_PORT,
        dialect: 'postgres'
    }
};

//# sourceMappingURL=config.js.map