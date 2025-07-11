import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/sequelize';
import User from './user.model';

interface GeneratedFormAttributes {
  formId: string;
  region: 'Jubail' | 'Dammam' | 'Maharashtra';
  form_link: string;
  status?: 'submitted' | 'pending' | 'disbursed' | 'rejected' | 'case closed' | 'accepted';
  created_on?: Date;
  submitted_on?: Date | null;
  creator_name: string;
  creatorId?: number;
  student_name: string; // ✅ New field
}

type GeneratedFormCreationAttributes = Optional<
  GeneratedFormAttributes,
  'status' | 'created_on' | 'submitted_on' | 'creatorId'
>;

class GeneratedForm extends Model<GeneratedFormAttributes, GeneratedFormCreationAttributes>
  implements GeneratedFormAttributes {
  public formId!: string;
  public region!: 'Jubail' | 'Dammam' | 'Maharashtra';
  public form_link!: string;
  public status!: 'submitted' | 'pending' | 'disbursed' | 'rejected' | 'case closed' | 'accepted' | undefined;
  public created_on!: Date;
  public submitted_on!: Date | null;
  public creator_name!: string;
  public creatorId?: number;
  public student_name!: string; // ✅ Add implementation
}

GeneratedForm.init(
  {
    formId: { type: DataTypes.STRING, unique: true, allowNull: false },
    region: { type: DataTypes.ENUM('Jubail', 'Dammam', 'Maharashtra'), allowNull: false },
    form_link: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM('submitted', 'pending', 'disbursed', 'rejected', 'case closed', 'accepted'),
      defaultValue: 'pending'
    },
    created_on: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    creator_name: { type: DataTypes.STRING, allowNull: false },
    submitted_on: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    student_name: { type: DataTypes.STRING, allowNull: false } 
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
