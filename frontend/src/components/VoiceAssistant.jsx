import { useState, useRef } from "react";
import axios from "axios";
import "./VoiceAssistant.css";

function VoiceAssistant() {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Ready to assist");
  const [messages, setMessages] = useState([]);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.wav");

        setStatus("Processing audio...");

        try {
          const res = await axios.post("https://openai-voiceassistant.onrender.com", formData);
          
          setMessages(prev => [
            ...prev,
            { sender: 'user', text: res.data.user_text },
            { sender: 'ai', text: res.data.ai_reply }
          ]);
          setStatus("Ready to assist");
        } catch (error) {
          console.error(error);
          setStatus("Error connecting to the AI.");
        }
      };

      mediaRecorder.start();
      setRecording(true);
      setStatus("Listening...");
    } catch (err) {
      console.error(err);
      setStatus("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="assistant-container">
      <div className="header">
        <h1>Nova</h1>
        <p>Your Intelligent Voice Assistant</p>
      </div>

      <div className="mic-container">
        <button 
          className={`mic-button ${recording ? 'recording' : ''}`}
          onClick={toggleRecording}
          aria-label={recording ? "Stop Recording" : "Start Recording"}
        >
          {recording ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          )}
        </button>
        {recording && <div className="mic-waves"></div>}
      </div>

      <div className="status-text">{status}</div>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoiceAssistant;
