"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getSingleParam", {
    enumerable: true,
    get: function() {
        return getSingleParam;
    }
});
const getSingleParam = (value)=>{
    if (typeof value === 'string') {
        return value;
    }
    if (Array.isArray(value)) {
        var _value_;
        return (_value_ = value[0]) !== null && _value_ !== void 0 ? _value_ : null;
    }
    return null;
};

//# sourceMappingURL=requestParams.js.map