import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";  // Importing custom CSS file

const socket = io("http://localhost:5000");

const LiveChat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { text: message, timestamp: new Date() };
      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Live Chat</h2>
      <div className="messages-box">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message">
              <span className="message-text">{msg.text}</span>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <div>No messages yet...</div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
