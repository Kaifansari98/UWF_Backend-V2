"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
const user_model_1 = __importDefault(require("./user.model"));
class BankInfoLetter extends sequelize_1.Model {
}
BankInfoLetter.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    principal_headmaster: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    school_college_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    student_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    admission_no_gr_no: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    student_parent_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    class_course_program: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    academic_year_term: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bank_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    account_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    account_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ifsc_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    branch_name_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    signatory_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    generated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    generated_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    deleted_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
    is_updated: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    updated_by: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'BankInfoLetter',
    tableName: 'bank_info_letters',
    timestamps: false,
});
BankInfoLetter.belongsTo(user_model_1.default, {
    foreignKey: 'signatory_user_id',
    as: 'signatoryUser',
});
BankInfoLetter.belongsTo(user_model_1.default, {
    foreignKey: 'generated_by',
    as: 'generatedByUser',
});
BankInfoLetter.belongsTo(user_model_1.default, {
    foreignKey: 'deleted_by',
    as: 'deletedByUser',
});
BankInfoLetter.belongsTo(user_model_1.default, {
    foreignKey: 'updated_by',
    as: 'updatedByUser',
});
exports.default = BankInfoLetter;
