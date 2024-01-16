import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [threadIdsByUser, setThreadIdsByUser] = useState({});

  const navigate = useNavigate();

  const fetchThreadIdsByUser = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://localhost:8000/api/thread_ids/", {
        method: "GET",
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

  const createChatThread = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "http://localhost:8000/api/create_chat_thread/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user_email: "example@email.com", // Replace with actual user email
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create chat thread");
      }
      // Handle the response as needed
    } catch (error) {
      console.error("Error creating chat thread:", error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (selectedThreadId) {
        const accessToken = localStorage.getItem("accessToken");
        try {
          const response = await fetch(
            `http://localhost:8000/api/chat_history?thread_id=${selectedThreadId}`,
            {
              method: "GET",
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
      <button onClick={handleBack} className="back-button">
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
          {Object.keys(threadIdsByUser).map((userEmail) => (
            <optgroup key={userEmail} label={userEmail}>
              {threadIdsByUser[userEmail].map((threadId) => (
                <option key={threadId} value={threadId}>
                  {threadId}
                </option>
              ))}
            </optgroup>
          ))}
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
                  <small>{message.formattedTimestamp}</small>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
