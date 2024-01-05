import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Fetch chat history from your Django backend
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/chat_history");
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
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
    </div>
  );
}
