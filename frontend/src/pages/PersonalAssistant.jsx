import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import './PersonalAssistant.css';

export default function PersonalAssistant() {
  const [messages, setMessages] = useState([
    {
      text: 'Hello. I am your technical interviewer for today. Ready to begin? Please tell me a bit about your background or start by saying "Start Interview".',
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message) return;

    setInputValue('');
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsTyping(true);

    try {
      const response = await api.post('/technical/interview', { message });
      setMessages(prev => [...prev, { 
        text: response.data?.response || response.data?.message || 'I am sorry, I encountered an error.', 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: 'System Error: Unable to reach the interview server. Please ensure backend is running.', 
        isUser: false 
      }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  return (
    <div className="pa-wrapper container mt-4 mb-5">
      <div className="pa-container">
        <header className="pa-header">
          <div className="pa-logo-section">
            <h4 className="m-0 fw-bold">AI Interviewer <span className="fs-6 fw-light opacity-75"></span></h4>
          </div>
          <div className="pa-status">
            <div className="pa-status-dot"></div>
            System Online
          </div>
        </header>

        <div className="pa-chat-window" id="chat-window" ref={chatWindowRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`pa-message ${msg.isUser ? 'pa-user-message' : 'pa-ai-message'}`} dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br>') }} />
          ))}

          {isTyping && (
            <div className="pa-typing-indicator" id="typing">
              <div className="pa-dot"></div>
              <div className="pa-dot"></div>
              <div className="pa-dot"></div>
            </div>
          )}
        </div>

        <div className="pa-input-area">
          <form id="chat-form" onSubmit={sendMessage} className="w-100">
            <div className="pa-input-container">
              <input 
                type="text" 
                id="user-input" 
                placeholder="Type your response here..." 
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                ref={inputRef}
              />
              <button type="submit" id="send-btn" disabled={isTyping || !inputValue.trim()}>Send</button>
            </div>
          </form>
          <div className="pa-footer-text">
            Your performance is being evaluated in real-time.
          </div>
        </div>
      </div>
    </div>
  );
}
