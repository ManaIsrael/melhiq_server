import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to the database.');
        return db;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

export default connectToDatabase;
