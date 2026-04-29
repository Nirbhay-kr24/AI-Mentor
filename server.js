require('dotenv').config({ path: '.env.local' });

const express = require('express');
const cors = require('cors');
const PERSONAS = require('./personas');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error('GOOGLE_API_KEY not found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

app.post('/api/chat', async (req, res) => {
  try {
    const { message, persona, conversationHistory } = req.body;

    if (!message || !persona) {
      return res.status(400).json({ error: 'Missing message or persona' });
    }

    const selectedPersona = PERSONAS[persona];

    if (!selectedPersona) {
      return res.status(400).json({ error: 'Invalid persona' });
    }

    const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: selectedPersona.systemPrompt
    });

    let history = [];

    if (conversationHistory?.length) {
      history = conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(message);

    res.json({
      success: true,
      message: result.response.text(),
      personaName: selectedPersona.name
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to get response from AI',
      details: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});