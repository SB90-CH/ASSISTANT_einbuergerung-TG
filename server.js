const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        // Create a message in the assistant's thread
        const response = await fetch(`https://api.openai.com/v1/assistants/${process.env.ASSISTANT_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                role: 'user',
                content: userMessage,
            }),
        });

        const data = await response.json();

        // Extract the assistant's reply
        const assistantReply = data.choices[0].message.content;

        res.json({ reply: assistantReply });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});
