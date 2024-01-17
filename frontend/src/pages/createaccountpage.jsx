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

      const data = await response.json();

      if (response.ok) {
        setErrorMessage("Account created successfully! Please login.");
        navigate("/"); // Navigate to the login page
      } else {
        // Adjusted to check for the specific error message from the server
        if (data.error === "Email already exists") {
          setErrorMessage(
            "Email already exists. Please try a different email."
          );
        } else {
          setErrorMessage(
            data.error || "Failed to create account. Please try again."
          );
        }
      }
    } catch (error) {
      // Generic catch block for network or other unexpected errors
      setErrorMessage(error.message || "An unexpected error occurred");
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
