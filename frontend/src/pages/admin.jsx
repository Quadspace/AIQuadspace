import React, { useState, useEffect } from "react";

export default function AdminPage() {
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Fetch chat history from your backend
  }, []);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://yourbackend.com/api/upload", {
        method: "POST",
        body: formData,
        // Note: When sending FormData, the 'Content-Type' header should not be set manually
        // as the browser will set it automatically with the correct boundary string
      });
      if (response.ok) {
        console.log("Files uploaded successfully");
        // Handle successful upload here
      } else {
        console.error("Upload failed");
        // Handle failure here
      }
    } catch (error) {
      console.error("Error during upload:", error);
      // Handle error here
    }
  };

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
      <div>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          accept="application/pdf"
        />
        <button onClick={uploadFiles}>Upload PDFs</button>
      </div>
    </div>
  );
}
