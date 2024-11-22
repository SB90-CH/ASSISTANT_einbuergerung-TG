const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve 'chat.html'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        const response = await fetch(`https://api.openai.com/v1/assistants/${process.env.ASSISTANT_ID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                input: {
                    type: 'text',
                    content: userMessage,
                },
            }),
        });

        const data = await response.json();
        res.json({ reply: data.output.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
