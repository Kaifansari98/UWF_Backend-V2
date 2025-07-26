"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
const user_model_1 = __importDefault(require("./user.model"));
class GeneratedForm extends sequelize_1.Model {
}
GeneratedForm.init({
    formId: { type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false },
    region: { type: sequelize_1.DataTypes.ENUM('Jubail', 'Dammam', 'Maharashtra'), allowNull: false },
    form_link: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: {
        type: sequelize_1.DataTypes.ENUM('submitted', 'pending', 'disbursed', 'rejected', 'case closed', 'accepted'),
        defaultValue: 'pending'
    },
    created_on: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    creator_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    submitted_on: { type: sequelize_1.DataTypes.DATE, allowNull: true, defaultValue: null },
    student_name: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    sequelize: sequelize_2.default,
    modelName: 'GeneratedForm',
    tableName: 'generated_forms'
});
// Association
GeneratedForm.belongsTo(user_model_1.default, {
    foreignKey: 'creatorId',
    as: 'creator'
});
exports.default = GeneratedForm;
