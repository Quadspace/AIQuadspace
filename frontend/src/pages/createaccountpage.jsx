import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      setErrorMessage("Account created successfully! Please login.");
      navigate("/"); // Navigate to the login page
    } catch (error) {
      setErrorMessage(error.message || "An error occurred");
    }
  };

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <>
      <h1 className="auth-title">Create Account</h1>
      <div className="auth-container">

        <img src="/logofull.png" alt="Quadspace Logo" className="auth-logo" />
        <div className="auth-form-container">
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
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
