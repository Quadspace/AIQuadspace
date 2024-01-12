import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        // Replace with your actual login endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle login success
        console.log("Login successful:", data);
        navigate("/chat"); // Navigate to the chat page
      } else {
        // Handle login failure
        if (response.status === 404) {
          alert("Account not found. Please sign up.");
        } else {
          alert("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account"); // Navigate to the create account page.
  };

  return (
    <div className="auth-container">
      <img src="/logofull.png" alt="Quadspace Logo" className="auth-logo" />
      <div className="auth-form-container">
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button className="auth-button" onClick={handleLogin}>
          Log In
        </button>
        <button
          className="auth-button auth-button-spacing"
          onClick={handleCreateAccount}
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
