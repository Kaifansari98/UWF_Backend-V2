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
const _usermodel = /*#__PURE__*/ _interop_require_default(require("./user.model"));
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
class GeneratedForm extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "formId", void 0), _define_property(this, "region", void 0), _define_property(this, "form_link", void 0), _define_property(this, "status", void 0), _define_property(this, "created_on", void 0), _define_property(this, "submitted_on", void 0), _define_property(this, "creator_name", void 0), _define_property(this, "creatorId", void 0), _define_property(this, "student_name", void 0 // ✅ Add implementation
        );
    }
}
GeneratedForm.init({
    formId: {
        type: _sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    region: {
        type: _sequelize.DataTypes.ENUM('Jubail', 'Dammam', 'Maharashtra'),
        allowNull: false
    },
    form_link: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: _sequelize.DataTypes.ENUM('submitted', 'pending', 'disbursed', 'rejected', 'case closed', 'accepted'),
        defaultValue: 'pending'
    },
    created_on: {
        type: _sequelize.DataTypes.DATE,
        defaultValue: _sequelize.DataTypes.NOW
    },
    creator_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    submitted_on: {
        type: _sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    student_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: _sequelize1.default,
    modelName: 'GeneratedForm',
    tableName: 'generated_forms'
});
// Association
GeneratedForm.belongsTo(_usermodel.default, {
    foreignKey: 'creatorId',
    as: 'creator'
});
const _default = GeneratedForm;

//# sourceMappingURL=generatedForm.model.js.map