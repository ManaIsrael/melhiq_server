export function validateBotToken(req, res, next) {
    const botToken = req.params.botToken;
    if (botToken === process.env.BOT_TOKEN) {
        next();
    } else {
        res.sendStatus(403);
    }
}
