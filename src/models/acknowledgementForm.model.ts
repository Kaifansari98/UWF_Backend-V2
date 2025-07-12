import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/sequelize';

class AcknowledgementForm extends Model {}

AcknowledgementForm.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  formId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'generated_forms',
      key: 'formId',
    },
    onDelete: 'CASCADE',
  },
  student_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  form_link: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  invoice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'submitted', 'accepted'),
    defaultValue: 'pending',
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'AcknowledgementForm',
  tableName: 'acknowledgement_forms',
  timestamps: false,
});

export default AcknowledgementForm;
