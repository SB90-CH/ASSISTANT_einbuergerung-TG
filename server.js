const express = require('express');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config(); // To load environment variables from a `.env` file

app.use(express.json());

// Chat endpoint
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/assistants/asst_LxXzE2wd8xEo1hnYXhgSH5Zl', {
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
