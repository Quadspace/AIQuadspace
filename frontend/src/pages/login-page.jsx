import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Here, add your logic to validate the user.
    // For now, it just navigates to the current home page.
    navigate("/chat"); // Assuming '/home' is the path for your current homepage.
  };

  const handleCreateAccount = () => {
    navigate("/create-account"); // Navigate to the create account page.
  };

  return (
    <div className="login-page">
      <img src="/logofull.png" alt="Quadspace Logo" />
      <div className="login-container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Log In</button>
        <button onClick={handleCreateAccount} className="smaller-button">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
