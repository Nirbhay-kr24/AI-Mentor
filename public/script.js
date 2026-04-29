// Frontend Chat Application Logic

const PERSONAS_DATA = {
  anshuman: {
    name: 'Anshuman Singh',
    welcome: 'Start a conversation with Anshuman Singh',
    icon: '👨‍💼',
    suggestions: [
      'How did you build Scaler Academy?',
      'What skills matter most for a senior engineer?',
      'How should I prepare for system design interviews?',
      'What\'s the biggest mistake engineers make in their career?'
    ]
  },
  kshitij: {
    name: 'Kshitij Mishra',
    welcome: 'Start a conversation with Kshitij Mishra',
    icon: '🧠',
    suggestions: [
      'What makes a successful tech career?',
      'How should I approach system design interviews?',
      'What\'s your framework for evaluating opportunities?',
      'How do you think about career growth?'
    ]
  },
  abhimanyu: {
    name: 'Abhimanyu Saxena',
    welcome: 'Start a conversation with Abhimanyu Saxena',
    icon: '❤️',
    suggestions: [
      'How do I stay motivated while learning?',
      'I\'m scared of failing in interviews. How do I overcome this?',
      'What does it take to go from junior to senior engineer?',
      'How do you think about mentoring and teaching?'
    ]
  }
};

// State
let currentPersona = 'anshuman';
let conversationHistory = [];
let isLoading = false;
let apiEndpoint = '/api/chat';

// DOM Elements
const personaBtns = document.querySelectorAll('.persona-btn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const suggestionChips = document.getElementById('suggestionChips');
const personaWelcome = document.getElementById('personaWelcome');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  renderSuggestions();
});

function initializeEventListeners() {
  // Persona buttons
  personaBtns.forEach(btn => {
    btn.addEventListener('click', () => switchPersona(btn.dataset.persona));
  });

  // Chat input
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  });

  // Send button
  sendBtn.addEventListener('click', sendMessage);
}

function switchPersona(persona) {
  if (persona === currentPersona) return;

  currentPersona = persona;

  // Update button states
  personaBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.persona === persona);
  });

  // Clear chat
  conversationHistory = [];
  chatMessages.innerHTML = '';

  // Update welcome message
  personaWelcome.textContent = PERSONAS_DATA[persona].welcome;

  // Render suggestions
  renderSuggestions();

  // Add welcome message
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'welcome-message';
  welcomeDiv.innerHTML = `
    <h2>Welcome!</h2>
    <p>${PERSONAS_DATA[persona].welcome}</p>
    <p class="welcome-subtitle">Ask anything about careers, learning, or growth</p>
  `;
  chatMessages.appendChild(welcomeDiv);
}

function renderSuggestions() {
  const suggestions = PERSONAS_DATA[currentPersona].suggestions;
  suggestionChips.innerHTML = suggestions
    .map(
      (suggestion) => `
    <button class="chip" onclick="sendSuggestion('${suggestion.replace(/'/g, "\\'")}')">
      ${suggestion}
    </button>
  `
    )
    .join('');
}

function sendSuggestion(suggestion) {
  chatInput.value = suggestion;
  sendMessage();
}

async function sendMessage() {
  const message = chatInput.value.trim();

  if (!message || isLoading) return;

  // Add user message to UI
  addMessageToChat(message, 'user');
  chatInput.value = '';
  chatInput.disabled = true;
  sendBtn.disabled = true;
  isLoading = true;

  // Remove welcome message if present
  const welcomeMsg = chatMessages.querySelector('.welcome-message');
  if (welcomeMsg) {
    welcomeMsg.remove();
  }

  // Show typing indicator
  const typingDiv = createTypingIndicator();
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    // Add to conversation history
    conversationHistory.push({
      role: 'user',
      content: message
    });

    // Call API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        persona: currentPersona,
        conversationHistory: conversationHistory.slice(0, -1), // Exclude current message from history
      }),
    });

    // Remove typing indicator
    if (typingDiv) typingDiv.remove();

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get response');
    }

    const data = await response.json();

    if (data.success) {
      // Add assistant message to history
      conversationHistory.push({
        role: 'assistant',
        content: data.message
      });

      // Add to UI
      addMessageToChat(data.message, 'assistant', data.personaName);
    } else {
      addMessageToChat('Error: Could not process your request.', 'assistant');
    }
  } catch (error) {
    // Remove typing indicator
    if (typingDiv) typingDiv.remove();

    console.error('Error:', error);
    addMessageToChat(
      `Sorry, I encountered an error: ${error.message}. Please check your API key in the backend.`,
      'assistant'
    );
  } finally {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    isLoading = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function addMessageToChat(text, sender, personaName = null) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;

  let content = '';
  if (sender === 'assistant' && personaName) {
    content = `
      <div class="message-content">
        <div class="message-header">${personaName}</div>
        ${text}
      </div>
    `;
  } else {
    content = `<div class="message-content">${text}</div>`;
  }

  messageDiv.innerHTML = content;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message assistant';
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  return typingDiv;
}

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page hidden
  } else {
    // Page visible - focus chat input
    if (!isLoading) {
      chatInput.focus();
    }
  }
});
