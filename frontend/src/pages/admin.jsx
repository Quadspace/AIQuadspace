import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [threadIdsByUser, setThreadIdsByUser] = useState({});

  const navigate = useNavigate();

  // Fetch thread identifiers by user
  const fetchThreadIdsByUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch("https://quadbot-rt.onrender.com/api/thread_ids/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chat threads by user");
      }
      const data = await response.json();
      setThreadIdsByUser(data);
    } catch (error) {
      console.error("Error fetching chat threads by user:", error);
    }
  };

  useEffect(() => {
    fetchThreadIdsByUser();
  }, []);

  
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedThreadId) {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const response = await fetch(
            `https://quadbot-rt.onrender.com/api/chat_history/${encodeURIComponent(
              selectedThreadId
            )}/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch chat history");
          }
          const data = await response.json();
          setChatHistory(data);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };

    fetchChatHistory();
  }, [selectedThreadId]);

  return (
    <div className="disclaimer-wrapper">
      <button onClick={() => navigate("/")} className="back-button">
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="admin-container">
        <h1>Admin</h1>
        <div className="logo-container">
          <img src="/logofull.png" alt="Quadspace Logo" />
        </div>
        <select
          value={selectedThreadId}
          onChange={(e) => setSelectedThreadId(e.target.value)}
          className="chat-input"
        >
          <option value="">Select a thread</option>
          {Object.entries(threadIdsByUser).map(
            ([userEmail, threadIdentifiers]) => (
              <optgroup key={userEmail} label={userEmail}>
                {threadIdentifiers.map((identifier, index) => (
                  <option key={index} value={identifier}>
                    Thread {index + 1}
                  </option>
                ))}
              </optgroup>
            )
          )}
        </select>
        <div className="chat-container" style={{ marginTop: "20px" }}>
          <div className="chat-box">
            <div className="chat-content">
              {chatHistory.map((message, index) => (
                <p
                  key={index}
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <strong>{message.role.toUpperCase()}:</strong>{" "}
                  {message.content}
                  <br />
                  <small>{new Date(message.timestamp).toLocaleString()}</small>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
