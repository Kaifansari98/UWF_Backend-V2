import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';
import User from './user.model';

class GeneratedForm extends Model {}

GeneratedForm.init(
  {
    formId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    region: {
      type: DataTypes.ENUM('Jubail', 'Dammam', 'Maharashtra'),
      allowNull: false
    },
    disbursement_amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    form_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('submitted', 'pending', 'disbursed', 'rejected', 'case closed'),
      defaultValue: 'pending'
    },
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    creator_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submitted_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'GeneratedForm',
    tableName: 'generated_forms'
  }
);

// Association
GeneratedForm.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

export default GeneratedForm;
