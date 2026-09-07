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
class BankInfoLetter extends _sequelize.Model {
    constructor(...args){
        super(...args), _define_property(this, "id", void 0), _define_property(this, "principal_headmaster", void 0), _define_property(this, "school_college_name", void 0), _define_property(this, "address", void 0), _define_property(this, "student_name", void 0), _define_property(this, "admission_no_gr_no", void 0), _define_property(this, "student_parent_name", void 0), _define_property(this, "class_course_program", void 0), _define_property(this, "academic_year_term", void 0), _define_property(this, "bank_name", void 0), _define_property(this, "account_name", void 0), _define_property(this, "account_number", void 0), _define_property(this, "ifsc_code", void 0), _define_property(this, "branch_name_address", void 0), _define_property(this, "signatory_user_id", void 0), _define_property(this, "generated_at", void 0), _define_property(this, "generated_by", void 0), _define_property(this, "is_deleted", void 0), _define_property(this, "deleted_by", void 0), _define_property(this, "is_updated", void 0), _define_property(this, "updated_by", void 0);
    }
}
BankInfoLetter.init({
    id: {
        type: _sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    principal_headmaster: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    school_college_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: _sequelize.DataTypes.TEXT,
        allowNull: false
    },
    student_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    admission_no_gr_no: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    student_parent_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    class_course_program: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    academic_year_term: {
        type: _sequelize.DataTypes.STRING,
        allowNull: false
    },
    bank_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    account_name: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    account_number: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    ifsc_code: {
        type: _sequelize.DataTypes.STRING,
        allowNull: true
    },
    branch_name_address: {
        type: _sequelize.DataTypes.TEXT,
        allowNull: true
    },
    signatory_user_id: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    generated_at: {
        type: _sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: _sequelize.DataTypes.NOW
    },
    generated_by: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    is_deleted: {
        type: _sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    deleted_by: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    is_updated: {
        type: _sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    updated_by: {
        type: _sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    }
}, {
    sequelize: _sequelize1.default,
    modelName: 'BankInfoLetter',
    tableName: 'bank_info_letters',
    timestamps: false
});
BankInfoLetter.belongsTo(_usermodel.default, {
    foreignKey: 'signatory_user_id',
    as: 'signatoryUser'
});
BankInfoLetter.belongsTo(_usermodel.default, {
    foreignKey: 'generated_by',
    as: 'generatedByUser'
});
BankInfoLetter.belongsTo(_usermodel.default, {
    foreignKey: 'deleted_by',
    as: 'deletedByUser'
});
BankInfoLetter.belongsTo(_usermodel.default, {
    foreignKey: 'updated_by',
    as: 'updatedByUser'
});
const _default = BankInfoLetter;

//# sourceMappingURL=bankInfoLetter.model.js.map