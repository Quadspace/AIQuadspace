import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();
    // Add your logic for creating an account here.
    // This could involve validation and then sending data to the backend.

    // Example validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // On successful account creation, you might navigate to the login page or the chat page
    navigate("/chat"); // or '/chat'
  };

  const handleGoToLogin = () => {
    navigate("/"); // Navigate to the login page
  };

  return (
    <>
      <h1 className="auth-title">Create Account</h1>
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
          <input
            className="auth-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <button className="auth-button" onClick={handleCreateAccount}>
            Create Account
          </button>
          <button
            className="auth-button auth-button-spacing"
            onClick={handleGoToLogin}
          >
            Go to Login
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateAccountPage;
