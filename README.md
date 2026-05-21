# 🎙️ AI Voice Assistant

An AI-powered full-stack voice assistant built using React, FastAPI, Whisper, and OpenRouter LLM APIs.

Speak into the microphone, convert speech into text using Whisper, and receive intelligent AI-generated responses in real time.

---

# 🚀 Features

- 🎤 Real-time voice recording
- 🧠 Speech-to-text using Whisper
- 🤖 AI responses using OpenRouter LLMs
- ⚡ FastAPI backend
- 🌐 React frontend
- ☁️ Deployable on Vercel + Render
- 🔒 Secure API key handling using environment variables

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Axios

## Backend
- FastAPI
- Whisper
- OpenRouter API
- Python

## AI Models
- Whisper Tiny
- Llama 3.1
- GPT OSS 120B

---

# 📁 Project Structure

```bash
ai-voice-assistant/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       └── VoiceAssistant.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
