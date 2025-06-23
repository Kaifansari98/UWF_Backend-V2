import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../database/sequelize'; // <- We'll define this connection

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FORM_CREATOR = 'form_creator',
  EVALUATOR = 'evaluator',
  TREASURER = 'treasurer',
  APPROVER = 'approver',
  DISBURSEMENT = 'disbursement_approver',
  CASE_CLOSURE = 'case_closure',
}

class User extends Model {
  public id!: number;
  public profile_pic!: string;
  public username!: string;
  public full_name!: string;
  public password!: string;
  public role!: UserRole;
  public email!: string;
  public age!: number;
  public country!: string;
  public state!: string;
  public city!: string;
  public pincode!: string;
  public mobile_no!: string;
}

User.init(
  {
    profile_pic: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    full_name: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      defaultValue: UserRole.ADMIN
    },
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    mobile_no: DataTypes.STRING
  },
  {
    tableName: 'users',
    sequelize,
    hooks: {
      beforeCreate: async (user: any) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  }
);

export default User;
