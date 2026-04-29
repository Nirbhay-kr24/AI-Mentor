# AI Mentor  - Persona Based Chatbot

Live Demo: https://ai-mentor-u176.onrender.com

## Overview
AI Mentor Studio is a persona-based AI chatbot that simulates conversations with:

- Anshuman Singh  
- Kshitij Mishra  
- Abhimanyu Saxena  

Each mentor has a unique prompt, tone, reasoning style, and conversation behavior powered by Gemini.

---

## Features

- Persona switching
- Distinct mentor personalities
- Gemini API powered chat
- Suggestion chips
- Typing indicator
- Responsive UI
- Error handling
- Modern professional chat interface

---

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express
- Gemini API

---

## File Structure

```text
ai-mentor-chatbot/
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── server.js
├── personas.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── prompts.md
├── reflection.md
└── README.md
```

---

## Local Setup

Clone repository:

```bash
git clone https://github.com/yourusername/ai-mentor-chatbot.git
cd ai-mentor-chatbot
```

Install dependencies:

```bash
npm install
```

Create environment file:

```env
GOOGLE_API_KEY=your_api_key_here
```

Run locally:

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## Deployment
Hosted on Render.

Build command:

```bash
npm install
```

Start command:

```bash
node server.js
```

Environment Variable:

```env
GOOGLE_API_KEY=your_api_key
```

---

## Personas

### Anshuman Singh
Focuses on engineering thinking, systems, and growth.

### Kshitij Mishra
Focuses on structured learning and career guidance.

### Abhimanyu Saxena
Focuses on startups, product thinking, and problem solving.

---
## Project Preview

### Home
![Home UI](screenshots/home.png)

### Chat Demo
![Chat Demo](screenshots/chat.png)
