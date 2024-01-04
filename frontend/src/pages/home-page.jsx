import React, { useState, useEffect, useRef } from "react";

export default function AIResponse({ openModal }) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(true);

  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Quad, here to chat with you about your warehouse processes and help you with your needs! ☀️<br><br> Let's chat about what's going on.",
    },
  ]);

  const handleChatStart = () => {
    setIsChatOpen(true);
    setShowTyping(true);

    setTimeout(() => {
      setShowTyping(false);
      appendToChatHistory({
        role: "assistant",
        content:
          "In a sentence or two, tell me what challenges you are facing in regards to your warehouse needs. Feel free to be casual like this is a discussion between friends or coworkers.",
      });
    }, 3500); // Delay for the second message
  };

  const chatContentRef = useRef(null);
  const inputRef = useRef(null);

  function linkify(inputText) {
    // URLs to be replaced with custom text
    const urlMappings = {
      "https://forms.office.com/r/ManC4Y7ZA8": "Details Form",
      "https://quadspace.us/": "Quadspace",
    };

    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

    return inputText.replace(urlRegex, function (url) {
      // Check if the url is one of the special cases
      if (urlMappings[url]) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${urlMappings[url]}</a>`;
      }
      // If not a special case, return the url as is
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue; text-decoration: underline;">${url}</a>`;
    });
  }

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
    setChatHistory((prevChatHistory) => {
      const formattedMessage = {
        ...message,
        content: formatList(message.content), // Format the content if it's a list
      };
      return [...prevChatHistory, formattedMessage];
    });
  };

  // const formatList = (content) => {
  //   const lines = content.split("\n");
  //   let formattedContent = "";
  //   let inList = false;

  //   for (let i = 0; i < lines.length; i++) {
  //     const line = lines[i].trim();
  //     if (line.startsWith("**")) {
  //       // Bold title with a colon
  //       const title = line.replace(/\*\*/g, "").trim();
  //       formattedContent += `${
  //         inList ? "<br><br>" : ""
  //       }<strong>${title}:</strong> `;
  //       inList = false;
  //     } else if (line.length > 0) {
  //       // List item or regular text
  //       formattedContent += `${inList ? "<br><br>" : ""}${line}`;
  //       inList = true;
  //     }
  //   }

  //   return formattedContent;
  // };
  const formatList = (content) => {
    const lines = content.split("\n");
    let formattedContent = "";
    let inList = false;
    let isSubBullet = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("**")) {
        // Bold title with a colon
        const title = line.replace(/\*\*/g, "").trim();
        formattedContent += `${
          inList ? "<br><br>" : ""
        }<strong>${title}:</strong> `;
        inList = false;
        isSubBullet = false;
      } else if (line.startsWith("-")) {
        // Sub bullet point
        formattedContent += `<br>${isSubBullet ? "" : "<br>"}${line}`;
        inList = true;
        isSubBullet = true;
      } else if (line.length > 0) {
        // Regular text
        formattedContent += `${inList ? "<br><br>" : ""}${line}`;
        inList = true;
        isSubBullet = false;
      }
    }

    return formattedContent;
  };

  const fetchFileContent = async () => {
    try {
      const response = await fetch("/knowledge.txt");
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
    setShowTyping(true); // Show typing animation
    setInputText(""); // Clear the text area immediately after submission

    // Construct the message content with the user's input
    const messageContent = {
      role: "user",
      content: inputText,
    };

    // Add the user's message to the chat history
    appendToChatHistory(messageContent);

    // Send the user's message to the Django backend for storage
    try {
      await fetch("http://127.0.0.1:8000/api/save_chat_message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Other headers if needed
        },
        body: JSON.stringify(messageContent),
      });
    } catch (error) {
      console.error("Error saving chat message:", error);
    }

    // Make the API call to OpenAI
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

      // Add the chatbot's response to the chat history
      appendToChatHistory(chatResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setShowTyping(false); // Hide typing animation
      setIsLoading(false); // Stop loading indicator
      if (inputRef.current) {
        inputRef.current.focus(); // Refocus on the input element
      }
    }
  };

  return (
    <>
      {!isChatOpen ? (
        <div className="disclaimer-wrapper">
          <div className="disclaimer-container">
            <img
              src="/logofull.png"
              alt="Quadspace Logo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <p>
              By clicking "Chat with Quad", I acknowledge that by using this
              chatbot, I give Quadspace, LLC permission to store and use all
              data entered into this chat conversation for the purposes of
              improving services and user experience. Your information will be
              handled in accordance with our Privacy Policy.
            </p>
            <button onClick={handleChatStart}>Chat with Quad</button>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <img
            src="/logofull.png"
            alt="Quadspace Logo"
            style={{
              maxWidth: "80%",
              height: "auto",
              display: "block", // Added to make the image a block-level element
              margin: "0 auto", // Added to center the image horizontally
            }}
          />

          <div className="chat-box" ref={chatContentRef}>
            <div className="chat-content">
              {chatHistory.map((message, index) => (
                <p
                  key={index}
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                  dangerouslySetInnerHTML={{ __html: linkify(message.content) }}
                />
              ))}
              {showTyping && (
                <div className="chat-bubble">
                  <div className="loading">
                    <div className="dot one"></div>
                    <div className="dot two"></div>
                    <div className="dot three"></div>
                  </div>
                  <div className="tail"></div>
                </div>
              )}
            </div>
          </div>
          <div className="input-container">
            <textarea
              ref={inputRef}
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
      )}
    </>
  );
}
