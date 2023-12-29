import React, { useState, useEffect, useRef } from "react";

export default function AIResponse({ openModal }) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Quad, here to chat with you about your warehouse processes and help you with your needs! ☀️",
    },
    {
      role: "assistant",
      content:
        "Let's chat about what is going on. In a sentence or two, tell me what challenges you are facing in regards to your warehouse needs. Feel free to be casual like this is a discussion between friends or coworkers.",
    },
  ]);

  const chatContentRef = useRef(null);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  const appendToChatHistory = (message) => {
    setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
  };

  const fetchFileContent = async () => {
    try {
      const response = await fetch("../../public/knowledge.txt"); // Replace with the actual path
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      return await response.text();
    } catch (error) {
      console.error("Error reading file:", error);
      return ""; // Return empty string if there's an error
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setInputText("");

    const messageContent = {
      role: "user",
      content: inputText,
    };

    appendToChatHistory(messageContent);

    try {
      const fileContent = await fetchFileContent();
      const systemMessage = fileContent
        ? { role: "system", content: fileContent }
        : null;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages: systemMessage
              ? [systemMessage, ...chatHistory, messageContent]
              : [...chatHistory, messageContent],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const chatResponse = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      appendToChatHistory(chatResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <>
      <div className="chat-container">
        <div className="chat-box" ref={chatContentRef}>
          <div className="chat-content">
            {chatHistory.map((message, index) => (
              <p
                key={index}
                className={
                  message.role === "user" ? "user-message" : "assistant-message"
                }
              >
                {message.content}
              </p>
            ))}
          </div>
        </div>
        <div className="input-container">
          <textarea
            className="chat-input"
            placeholder="Type a message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <div className="loader"></div> : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
