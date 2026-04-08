import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import './PersonalAssistant.css';

export default function PersonalAssistant() {
  const [messages, setMessages] = useState([
    {
      text: 'Hello. I am your technical interviewer for today. Ready to begin?',
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
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    setIsTyping(true);

    try {
      const response = await api.post('/technical/interview', { message });
      setMessages((prev) => [
        ...prev,
        {
          text: response.data?.response || response.data?.message || 'I am sorry, I encountered an error.',
          isUser: false
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'System Error: Unable to reach the interview server. Please ensure backend is running.',
          isUser: false
        }
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  return (
    <div className="pa-page p-responsive">
      <div className="pa-container">

        <header className="pa-header">
          <div className="pa-logo-section">
            <h1>AI Interviewer</h1>
          </div>
          <div className="pa-status">
            <div className="pa-status-dot"></div>
            System Online
          </div>
        </header>

        <div className="pa-chat-window" ref={chatWindowRef}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
            >
              {msg.text.split('\n').map((line, lineIndex) => (
                <React.Fragment key={lineIndex}>
                  {line}
                  {lineIndex < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          ))}
          {isTyping && (
            <div className="typing-indicator" id="typing">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          )}
        </div>

        <div className="input-area">
          <form className="chat-form" onSubmit={sendMessage}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Type your response here..."
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                ref={inputRef}
              />
              <button type="submit" disabled={isTyping || !inputValue.trim()}>
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
