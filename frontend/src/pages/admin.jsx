import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);

  // Function to format a timestamp into "dd/mm/yy hh:mm:ss AM/PM" format
  const formatTimestamp = (timestamp) => {
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  useEffect(() => {
    // Fetch chat history from your Django backend
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/chat_history");
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();

        // Sort the chat history by timestamp in ascending order (earliest to latest)
        const sortedChatHistory = data.sort((a, b) =>
          a.timestamp.localeCompare(b.timestamp)
        );

        // Format the timestamps
        const formattedChatHistory = sortedChatHistory.map((message) => ({
          ...message,
          formattedTimestamp: formatTimestamp(message.timestamp),
        }));

        setChatHistory(formattedChatHistory);
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
            <p>
              <small>{message.formattedTimestamp}</small>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
