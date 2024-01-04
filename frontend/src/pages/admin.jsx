import React, { useState, useEffect } from "react";
// Import other necessary libraries and components

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Fetch chat history from your backend
    // Example: fetch('http://yourbackend.com/api/chat_history')
    // .then(response => response.json())
    // .then(data => setChatHistory(data));
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Panel - Chat History</h1>
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <p>
              <strong>{message.role.toUpperCase()}:</strong> {message.content}
            </p>
          </div>
        ))}
      </div>
      {/* Add any additional admin functionalities you need here */}
    </div>
  );
}
