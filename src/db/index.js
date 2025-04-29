import mysql from 'mysql2/promise';
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: DB_NAME
        });

        console.log(`MySQL Connected to ${DB_NAME} at ${process.env.MYSQL_HOST}`);
        return connection; // optionally export this for queries
    } catch (error) {
        console.error("MySQL connection error", error);
        process.exit(1);
    }
    };

export default connectDB;
