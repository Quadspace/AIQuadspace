import React from "react";

export default function HomePage() {
  return (
    <>
      <div className="chat-container">
        <div className="chat-box">
          <div className="chat-content">{/* Chat messages will go here */}</div>
          <div className="input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
            />
            <button className="send-button">Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
