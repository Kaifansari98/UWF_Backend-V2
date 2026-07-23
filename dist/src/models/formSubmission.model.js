// src/models/formSubmission.model.ts
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
const _sequelize1 = /*#__PURE__*/ _interop_require_default(require("../database/sequelize"));
const _generatedFormmodel = /*#__PURE__*/ _interop_require_default(require("./generatedForm.model"));
const _acknowledgementFormmodel = /*#__PURE__*/ _interop_require_default(require("./acknowledgementForm.model"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class FormSubmission extends _sequelize.Model {
}
FormSubmission.init({
    formId: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'generated_forms',
            key: 'formId'
        },
        onDelete: 'CASCADE'
    },
    firstName: _sequelize.DataTypes.STRING,
    fatherName: _sequelize.DataTypes.STRING,
    familyName: _sequelize.DataTypes.STRING,
    gender: _sequelize.DataTypes.ENUM('male', 'female'),
    schoolName: _sequelize.DataTypes.STRING,
    studyMedium: _sequelize.DataTypes.STRING,
    class: _sequelize.DataTypes.STRING,
    academicYear: _sequelize.DataTypes.STRING,
    parentName: _sequelize.DataTypes.STRING,
    mobile: _sequelize.DataTypes.STRING,
    alternateMobile: _sequelize.DataTypes.STRING,
    address: _sequelize.DataTypes.TEXT,
    incomeSource: _sequelize.DataTypes.STRING,
    reason: _sequelize.DataTypes.TEXT,
    requested_amount: _sequelize.DataTypes.FLOAT,
    feesStructure: _sequelize.DataTypes.STRING,
    marksheet: _sequelize.DataTypes.STRING,
    signature: _sequelize.DataTypes.STRING,
    parentApprovalLetter: _sequelize.DataTypes.STRING,
    bankAccountHolder: _sequelize.DataTypes.STRING,
    bankAccountNumber: _sequelize.DataTypes.STRING,
    ifscCode: _sequelize.DataTypes.STRING,
    bankName: _sequelize.DataTypes.STRING,
    coordinatorName: _sequelize.DataTypes.STRING,
    coordinatorMobile: _sequelize.DataTypes.STRING,
    submitted_at: {
        type: _sequelize.DataTypes.DATE,
        defaultValue: _sequelize.DataTypes.NOW
    },
    form_accepted: {
        type: _sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    form_disbursed: {
        type: _sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    form_case_closed: {
        type: _sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    isRejected: {
        type: _sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    },
    acceptedAmount: {
        type: _sequelize.DataTypes.FLOAT,
        allowNull: true
    }
}, {
    sequelize: _sequelize1.default,
    modelName: 'FormSubmission',
    tableName: 'form_submissions'
});
FormSubmission.belongsTo(_generatedFormmodel.default, {
    foreignKey: 'formId',
    targetKey: 'formId'
});
FormSubmission.hasOne(_acknowledgementFormmodel.default, {
    foreignKey: "formId",
    sourceKey: "formId"
});
_acknowledgementFormmodel.default.belongsTo(FormSubmission, {
    foreignKey: "formId",
    targetKey: "formId"
});
const _default = FormSubmission;

//# sourceMappingURL=formSubmission.model.js.map