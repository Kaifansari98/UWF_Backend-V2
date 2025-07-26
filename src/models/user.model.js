"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_2 = __importDefault(require("../database/sequelize")); // <- We'll define this connection
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["FORM_CREATOR"] = "form_creator";
    UserRole["EVALUATOR"] = "evaluator";
    UserRole["TREASURER"] = "treasurer";
    UserRole["APPROVER"] = "approver";
    UserRole["DISBURSEMENT"] = "disbursement_approver";
    UserRole["CASE_CLOSURE"] = "case_closure";
})(UserRole || (exports.UserRole = UserRole = {}));
class User extends sequelize_1.Model {
}
User.init({
    profile_pic: sequelize_1.DataTypes.STRING,
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    full_name: sequelize_1.DataTypes.STRING,
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.ADMIN
    },
    email: sequelize_1.DataTypes.STRING,
    age: sequelize_1.DataTypes.INTEGER,
    country: sequelize_1.DataTypes.STRING,
    state: sequelize_1.DataTypes.STRING,
    city: sequelize_1.DataTypes.STRING,
    pincode: sequelize_1.DataTypes.STRING,
    mobile_no: sequelize_1.DataTypes.STRING
}, {
    tableName: 'users',
    sequelize: sequelize_2.default,
    hooks: {
        beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.password) {
                user.password = yield bcrypt_1.default.hash(user.password, 10);
            }
        })
    }
});
exports.default = User;
