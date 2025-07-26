"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../database/sequelize"));
class AcknowledgementForm extends sequelize_1.Model {
}
AcknowledgementForm.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    formId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'generated_forms',
            key: 'formId',
        },
        onDelete: 'CASCADE',
    },
    student_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    form_link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    invoice: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'submitted', 'accepted'),
        defaultValue: 'pending',
    },
    submitted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: 'AcknowledgementForm',
    tableName: 'acknowledgement_forms',
    timestamps: false,
});
exports.default = AcknowledgementForm;
