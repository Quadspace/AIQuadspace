import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccountPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    // Clear any existing session data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    try {
      const loginResponse = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        // Store the new tokens
        localStorage.setItem("accessToken", loginData.access);
        localStorage.setItem("refreshToken", loginData.refresh);
        localStorage.setItem("userEmail", email);
        navigate("/chat"); // Adjust URL as needed
      } else {
        throw new Error(loginData.detail || "Login failed");
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during login");
    }
  };

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

      if (response.ok) {
        // Log in the new user after successful account creation
        await handleLogin(email, password);
      } else {
        const data = await response.json();
        setErrorMessage(
          data.error || "Failed to create account. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  };
  const handleGoToLogin = () => {
    navigate("/"); // Navigate to the login page
  };

  return (
    <>
      <div className="auth-container">
        <img src="/logofull.png" alt="Quadspace Logo" className="auth-logo" />
        <div className="auth-form-container">
      <h1 className="auth-title">Create Account</h1>
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
