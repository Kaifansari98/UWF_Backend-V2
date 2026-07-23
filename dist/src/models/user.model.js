"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get UserRole () {
        return UserRole;
    },
    get default () {
        return _default;
    }
});
const _sequelize = require("sequelize");
const _bcrypt = /*#__PURE__*/ _interop_require_default(require("bcrypt"));
const _sequelize1 = /*#__PURE__*/ _interop_require_default(require("../database/sequelize"));
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["FORM_CREATOR"] = "form_creator";
    UserRole["EVALUATOR"] = "evaluator";
    UserRole["TREASURER"] = "treasurer";
    UserRole["APPROVER"] = "approver";
    UserRole["DISBURSEMENT"] = "disbursement_approver";
    UserRole["CASE_CLOSURE"] = "case_closure";
    return UserRole;
}({});
class User extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "profile_pic", void 0), _define_property(this, "username", void 0), _define_property(this, "full_name", void 0), _define_property(this, "password", void 0), _define_property(this, "role", void 0), _define_property(this, "email", void 0), _define_property(this, "age", void 0), _define_property(this, "country", void 0), _define_property(this, "state", void 0), _define_property(this, "city", void 0), _define_property(this, "pincode", void 0), _define_property(this, "mobile_no", void 0);
    }
}
User.init({
    profile_pic: _sequelize.DataTypes.STRING,
    username: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    full_name: _sequelize.DataTypes.STRING,
    password: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: _sequelize.DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: "admin"
    },
    email: _sequelize.DataTypes.STRING,
    age: _sequelize.DataTypes.INTEGER,
    country: _sequelize.DataTypes.STRING,
    state: _sequelize.DataTypes.STRING,
    city: _sequelize.DataTypes.STRING,
    pincode: _sequelize.DataTypes.STRING,
    mobile_no: _sequelize.DataTypes.STRING
}, {
    tableName: 'users',
    sequelize: _sequelize1.default,
    hooks: {
        beforeCreate: (user)=>_async_to_generator(function*() {
                if (user.password) {
                    user.password = yield _bcrypt.default.hash(user.password, 10);
                }
            })(),
        beforeUpdate: (user)=>_async_to_generator(function*() {
                if (user.changed('password')) {
                    user.password = yield _bcrypt.default.hash(user.password, 10);
                }
            })()
    }
});
const _default = User;

//# sourceMappingURL=user.model.js.map