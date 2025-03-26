const fetch = require('node-fetch');
const express = require('express');
const app = express();
const path = require('path');
const TELEGRAM_API_URL = 'https://api.telegram.org/bot<YOUR_BOT_API_TOKEN>'; // Replace with your bot's API token
const PORT = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files (Mini App)

app.post('/webhook', (req, res) => {
    const message = req.body.message;
    if (message && message.text) {
        const chatId = message.chat.id;
        const text = message.text.toLowerCase();

        if (text === '/start') {
            sendTelegramMessage(chatId, 'Welcome to the Mini App! Click the button below to open the app.');
        }
    }
    res.send();
});

const sendTelegramMessage = (chatId, text) => {
    fetch(`${TELEGRAM_API_URL}/sendMessage?chat_id=${chatId}&text=${text}&reply_markup={"inline_keyboard":[[{"text":"Open Mini App","web_app":{"url":"https://<YOUR_SERVER_URL>/hello"}}]]}`)
        .then(response => response.json())
        .catch(err => console.error('Error sending message:', err));
};

// Define route to serve the Mini App
app.get('/hello', (req, res) => {
    console.log(process.env.HOST);
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
