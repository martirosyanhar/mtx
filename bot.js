import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.BOT_API_TOKEN}`;
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware для парсинга JSON

app.post('/webhook', async (req, res) => {
    const message = req.body.message;
    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text.toLowerCase();

        if (text === '/start') {
            await sendTelegramMessage(chatId, 'Welcome to the Mini App! Click the button below to open the app.');
        }
    }
    res.sendStatus(200);
});

const sendTelegramMessage = async (chatId, text) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const url = `${TELEGRAM_API_URL}/sendMessage`;
        const payload = {
            chat_id: chatId,
            text: text,
            reply_markup: {
                inline_keyboard: [[{ text: "Open Mini App", web_app: { url: `${process.env.HOST}/hello` } }]]
            }
        };

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('Error sending message:', err);
    }
};

app.get('/hello', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
