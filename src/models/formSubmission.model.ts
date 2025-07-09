// src/models/formSubmission.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';
import GeneratedForm from './generatedForm.model';

class FormSubmission extends Model {}

FormSubmission.init(
  {
    formId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'generated_forms',
        key: 'formId'
      },
      onDelete: 'CASCADE'
    },
    firstName: DataTypes.STRING,
    fatherName: DataTypes.STRING,
    familyName: DataTypes.STRING,
    gender: DataTypes.ENUM('male', 'female'),
    schoolName: DataTypes.STRING,
    studyMedium: DataTypes.STRING,
    class: DataTypes.STRING,
    academicYear: DataTypes.STRING,
    parentName: DataTypes.STRING,
    mobile: DataTypes.STRING,
    alternateMobile: DataTypes.STRING,
    address: DataTypes.TEXT,
    incomeSource: DataTypes.STRING,
    reason: DataTypes.TEXT,
    requested_amount: DataTypes.FLOAT,
    feesStructure: DataTypes.STRING,
    marksheet: DataTypes.STRING,
    signature: DataTypes.STRING,
    parentApprovalLetter: DataTypes.STRING,
    bankAccountHolder: DataTypes.STRING,
    bankAccountNumber: DataTypes.STRING,
    ifscCode: DataTypes.STRING,
    bankName: DataTypes.STRING,
    coordinatorName: DataTypes.STRING,
    coordinatorMobile: DataTypes.STRING,
    submitted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    form_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    form_disbursed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    form_case_closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isRejected: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    acceptedAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },  
  },
  {
    sequelize,
    modelName: 'FormSubmission',
    tableName: 'form_submissions'
  }
);

FormSubmission.belongsTo(GeneratedForm, { foreignKey: 'formId', targetKey: 'formId' });

export default FormSubmission;