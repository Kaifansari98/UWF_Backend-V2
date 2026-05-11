import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/sequelize';
import User from './user.model';

interface BankInfoLetterAttributes {
  id: number;
  principal_headmaster: string;
  school_college_name: string;
  address: string;
  student_name: string;
  admission_no_gr_no: string;
  student_parent_name: string;
  class_course_program: string;
  academic_year_term: string;
  bank_name?: string | null;
  account_name?: string | null;
  account_number?: string | null;
  ifsc_code?: string | null;
  branch_name_address?: string | null;
  signatory_user_id?: number | null;
  generated_at?: Date;
  generated_by?: number | null;
  is_deleted?: boolean;
  deleted_by?: number | null;
  is_updated?: boolean;
  updated_by?: number | null;
}

type BankInfoLetterCreationAttributes = Optional<
  BankInfoLetterAttributes,
  | 'id'
  | 'signatory_user_id'
  | 'generated_at'
  | 'generated_by'
  | 'is_deleted'
  | 'deleted_by'
  | 'is_updated'
  | 'updated_by'
>;

class BankInfoLetter
  extends Model<BankInfoLetterAttributes, BankInfoLetterCreationAttributes>
  implements BankInfoLetterAttributes
{
  public id!: number;
  public principal_headmaster!: string;
  public school_college_name!: string;
  public address!: string;
  public student_name!: string;
  public admission_no_gr_no!: string;
  public student_parent_name!: string;
  public class_course_program!: string;
  public academic_year_term!: string;
  public bank_name!: string | null;
  public account_name!: string | null;
  public account_number!: string | null;
  public ifsc_code!: string | null;
  public branch_name_address!: string | null;
  public signatory_user_id!: number | null;
  public generated_at!: Date;
  public generated_by!: number | null;
  public is_deleted!: boolean;
  public deleted_by!: number | null;
  public is_updated!: boolean;
  public updated_by!: number | null;
}

BankInfoLetter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    principal_headmaster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school_college_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admission_no_gr_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_parent_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_course_program: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    academic_year_term: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branch_name_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signatory_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    generated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    generated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    is_updated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'BankInfoLetter',
    tableName: 'bank_info_letters',
    timestamps: false,
  }
);

BankInfoLetter.belongsTo(User, {
  foreignKey: 'signatory_user_id',
  as: 'signatoryUser',
});

BankInfoLetter.belongsTo(User, {
  foreignKey: 'generated_by',
  as: 'generatedByUser',
});

BankInfoLetter.belongsTo(User, {
  foreignKey: 'deleted_by',
  as: 'deletedByUser',
});

BankInfoLetter.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'updatedByUser',
});

export default BankInfoLetter;
