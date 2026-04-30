import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbName = process.env.DB_NAME?.trim();
const dbUsername = process.env.DB_USERNAME?.trim();
const dbPassword = process.env.DB_PASSWORD?.trim();
const dbHost = process.env.DB_HOST?.trim();

const sequelize = new Sequelize(
  dbName!,
  dbUsername!,
  dbPassword!,
  {
    host: dbHost,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false
  }
);

export default sequelize;
