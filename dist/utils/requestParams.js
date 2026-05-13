"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleParam = void 0;
const getSingleParam = (value) => {
    var _a;
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value)) {
        return (_a = value[0]) !== null && _a !== void 0 ? _a : null;
    }
    return null;
};
exports.getSingleParam = getSingleParam;
