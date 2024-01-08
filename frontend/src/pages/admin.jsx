import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [threadIds, setThreadIds] = useState([]); // State for storing unique thread IDs

  // Function to fetch unique thread IDs from the backend
  const fetchThreadIds = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/thread_ids");
      if (!response.ok) {
        throw new Error("Failed to fetch thread IDs");
      }
      const data = await response.json();
      setThreadIds(data);
    } catch (error) {
      console.error("Error fetching thread IDs:", error);
    }
  };

  useEffect(() => {
    fetchThreadIds(); // Fetch thread IDs when the component mounts
  }, []);

  useEffect(() => {
    // Fetch chat history for the selected thread ID
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/chat_history?thread_id=${selectedThreadId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (selectedThreadId) {
      fetchChatHistory();
    }
  }, [selectedThreadId]);

  return (
    <div className="admin-container">
      <select
        value={selectedThreadId}
        onChange={(e) => setSelectedThreadId(e.target.value)}
      >
        <option value="">Select a thread</option>
        {threadIds.map((threadId, index) => (
          <option key={index} value={threadId}>
            {threadId}
          </option>
        ))}
      </select>

      {/* Chat history display */}
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.role === "user" ? "user-message" : "assistant-message"
            }`}
          >
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
