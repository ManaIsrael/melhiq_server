import fetch from 'node-fetch';
import db from '../config/db.js';

// Handle incoming message
function handleIncomingMessage(req, res) {
    const message = req.body.message;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        if (text === '/start') {
            startBot(chatId);
        } else if (text === '/apply') {
            sendApplicationInstructions(chatId);
        } else {
            sendMessage(chatId, 'I did not understand that command. Try /apply to begin.');
        }
    }

    res.sendStatus(200); // Confirm update received
}

// Handle inline keyboard callback
function handleCallbackQuery(req, res) {
    const callbackQuery = req.body.callback_query;

    if (callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        if (data === 'create_profile') {
            sendMessage(chatId, 'Let\'s start creating your profile. Please provide your name.');
        } else if (data === 'view_jobs') {
            sendAvailableJobs(chatId);
        }

        answerCallbackQuery(callbackQuery.id);
    }

    res.sendStatus(200); // Confirm callback handled
}

// Helper function to send a welcome message and save user to DB
function startBot(chatId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: 'Welcome to the Melhiq Job Bot! Use /apply to start applying for jobs.'
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error sending message:', error));

    // Save user to database if not already saved
    db.execute('SELECT * FROM users WHERE chat_id = ?', [chatId], (err, results) => {
        if (err) {
            console.error('Error checking user in database:', err);
        } else if (results.length === 0) {
            db.execute(
                'INSERT INTO users (chat_id, first_name, last_name, username) VALUES (?, ?, ?, ?)',
                [chatId, 'Unknown', 'Unknown', 'Unknown'], // Placeholder values, modify as needed
                (err) => {
                    if (err) {
                        console.error('Error inserting user into database:', err);
                    }
                }
            );
        }
    });
}

// Helper function to send a message
function sendMessage(chatId, text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: text
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error sending message:', error));
}

function sendApplicationInstructions(chatId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: 'Click the button below to create your profile and apply for jobs!',
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Create Profile', callback_data: 'create_profile' }],
                [{ text: 'View Available Jobs', callback_data: 'view_jobs' }]
            ]
        }
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error sending application instructions:', error));
}

function answerCallbackQuery(callbackQueryId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
    const data = { callback_query_id: callbackQueryId };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error answering callback query:', error));
}

export { handleIncomingMessage, handleCallbackQuery };