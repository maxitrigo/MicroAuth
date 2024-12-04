import * as dotenv from 'dotenv'

dotenv.config();

export const DB_PORT = Number(process.env.DB_PORT);
export const DB_TYPE = process.env.DB_TYPE;
export const DB_HOST = process.env.DB_HOST;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE
export const JWT_SECRET = process.env.JWT_SECRET
export const MAIL_USERNAME = process.env.MAIL_USERNAME
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MAIL_PORT = process.env.MAIL_PORT
export const MAIL_HOST = process.env.MAIL_HOST
export const MAIL_SENDER = process.env.MAIL_SENDER