'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        text: message,
        timestamp: new Date(),
        isUser: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      
      setTimeout(() => {
        const response = {
          text: "Thanks for your message!",
          timestamp: new Date(),
          isUser: false
        };
        setMessages(prev => [...prev, response]);
        scrollToBottom();
      }, 1000);
    }
  };

  const downloadChat = () => {
    const chatContent = messages
      .map(msg => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.isUser ? 'You' : 'Bot'}: ${msg.text}`)
      .join('\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>💬 Live Chat</h2>
        <span className="online-status">● Online</span>
      </header>
      
      <main>
        <div className="chat-controls">
          <button onClick={downloadChat} className="download-button">
            📥 Download Chat History
          </button>
        </div>
        
        <div className="messages-box">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.isUser ? 'user-message' : 'response-message'}`}
            >
              <span className="message-text">{msg.text}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
