import mysql from 'mysql2/promise';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
try {
    const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: DB_NAME,
    });

    console.log(`Connected to ${DB_NAME} at ${process.env.MYSQL_HOST}`);
    return connection;
} catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
}
};

export default connectDB;
