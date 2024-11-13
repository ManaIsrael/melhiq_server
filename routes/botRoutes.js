import express from 'express';
import { handleIncomingMessage, handleCallbackQuery } from '../controllers/botController.js';
import { validateBotToken } from '../middleware/validateBotToken.js';

const router = express.Router();

router.post('/webhook/:botToken', validateBotToken, (req, res) => {
    const { message, callback_query } = req.body;

    if (message) {
        handleIncomingMessage(req, res);
    } else if (callback_query) {
        handleCallbackQuery(req, res);
    } else {
        res.sendStatus(200);
    }
});

export default router;
