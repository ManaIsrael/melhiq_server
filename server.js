import express from 'express';
import botRoutes from './routes/botRoutes.js';
import connectToDatabase from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectToDatabase()
    .then(db => {
        // Middleware to parse JSON bodies
        app.use(express.json());

        // Use bot routes
        app.use('/', botRoutes);

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error("Failed to connect to the database:", error));
