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
class AcknowledgementForm extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "createdAt", void 0), _define_property(this, "updatedAt", void 0);
    }
}
AcknowledgementForm.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    formId: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'generated_forms',
            key: 'formId'
        },
        onDelete: 'CASCADE'
    },
    student_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    form_link: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    invoice: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: _sequelize.DataTypes.ENUM('pending', 'submitted', 'accepted'),
        defaultValue: 'pending'
    },
    submitted_at: {
        type: _sequelize.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: _sequelize1.default,
    modelName: 'AcknowledgementForm',
    tableName: 'acknowledgement_forms'
});
const _default = AcknowledgementForm;

//# sourceMappingURL=acknowledgementForm.model.js.map