"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/formSubmission.model.ts
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
const generatedForm_model_1 = __importDefault(require("./generatedForm.model"));
const acknowledgementForm_model_1 = __importDefault(require("./acknowledgementForm.model"));
class FormSubmission extends sequelize_1.Model {
}
FormSubmission.init({
    formId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'generated_forms',
            key: 'formId'
        },
        onDelete: 'CASCADE'
    },
    firstName: sequelize_1.DataTypes.STRING,
    fatherName: sequelize_1.DataTypes.STRING,
    familyName: sequelize_1.DataTypes.STRING,
    gender: sequelize_1.DataTypes.ENUM('male', 'female'),
    schoolName: sequelize_1.DataTypes.STRING,
    studyMedium: sequelize_1.DataTypes.STRING,
    class: sequelize_1.DataTypes.STRING,
    academicYear: sequelize_1.DataTypes.STRING,
    parentName: sequelize_1.DataTypes.STRING,
    mobile: sequelize_1.DataTypes.STRING,
    alternateMobile: sequelize_1.DataTypes.STRING,
    address: sequelize_1.DataTypes.TEXT,
    incomeSource: sequelize_1.DataTypes.STRING,
    reason: sequelize_1.DataTypes.TEXT,
    requested_amount: sequelize_1.DataTypes.FLOAT,
    feesStructure: sequelize_1.DataTypes.STRING,
    marksheet: sequelize_1.DataTypes.STRING,
    signature: sequelize_1.DataTypes.STRING,
    parentApprovalLetter: sequelize_1.DataTypes.STRING,
    bankAccountHolder: sequelize_1.DataTypes.STRING,
    bankAccountNumber: sequelize_1.DataTypes.STRING,
    ifscCode: sequelize_1.DataTypes.STRING,
    bankName: sequelize_1.DataTypes.STRING,
    coordinatorName: sequelize_1.DataTypes.STRING,
    coordinatorMobile: sequelize_1.DataTypes.STRING,
    submitted_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    form_accepted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    form_disbursed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    form_case_closed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    isRejected: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    acceptedAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'FormSubmission',
    tableName: 'form_submissions'
});
FormSubmission.belongsTo(generatedForm_model_1.default, { foreignKey: 'formId', targetKey: 'formId' });
FormSubmission.hasOne(acknowledgementForm_model_1.default, {
    foreignKey: "formId",
    sourceKey: "formId",
});
acknowledgementForm_model_1.default.belongsTo(FormSubmission, {
    foreignKey: "formId",
    targetKey: "formId",
});
exports.default = FormSubmission;
