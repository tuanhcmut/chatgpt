const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;


app.options('*', cors());  
app.use(cors());
app.use(express.json());

// Endpoint to handle chat messages (highlight)
app.post('/chat', async (req, res) => {

    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini', // Use the desired model
            messages: [{ role: 'system', content: userMessage }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const botReply = response.data.choices[0].message.content;
        res.json({ response: botReply });

    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        res.status(500).json({ error : 'Failed to communicate with the AI service.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});

