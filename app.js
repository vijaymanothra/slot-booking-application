import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { authorizeHandler } from './src/handlers/authorizeHandler.js';
import { bookSlotHandler } from './src/handlers/bookSlotHandler.js';
import { setSlotsHandler } from './src/handlers/setSlotsHandler.js';
import { updateEmployeeHandler } from './src/handlers/updateEmployeeHandler.js';
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Route for authorization (OTP generation)
app.post('/authorize', async (req, res) => {
    try {
        const response = await authorizeHandler(req.body);
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.error('Error in /authorize:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route for booking a slot
app.post('/book_slot', async (req, res) => {
    try {
        const response = await bookSlotHandler(req.body);
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.error('Error in /book_slot:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route for setting slots (admin only)
app.post('/set_slots', async (req, res) => {
    try {
        const response = await setSlotsHandler(req.body);
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.error('Error in /set_slots:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route for updating employee details
app.post('/update_employee', async (req, res) => {
    try {
        const response = await updateEmployeeHandler(req.body);
        res.status(response.statusCode).json(response);
    } catch (error) {
        console.error('Error in /update_employee:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});