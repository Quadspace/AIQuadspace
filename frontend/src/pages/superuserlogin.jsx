import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperuserLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/superuser_login/",
        {
          // Update the URL to the new endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("isSuperuser", "true"); // Set the flag to indicate superuser authentication
        navigate("/admin");
      } else {
        setError(data.message || "Incorrect username or password");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    }
  };

  const handleBack = () => {
    navigate("/"); // Navigate back to the homepage
  };

  return (
    <div className="login-form-wrapper">
      <button onClick={handleBack} className="login-back-button">
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="login-form-container">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-container">
            <label htmlFor="username" className="admin-form-label">
              Username:
            </label>
            <input
              className="admin-chat-input"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-container">
            <label htmlFor="password" className="admin-form-label">
              Password:
            </label>
            <input
              className="admin-chat-input"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="admin-send-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperuserLoginForm;
