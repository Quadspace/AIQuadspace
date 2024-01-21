import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 

    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    try {
      const loginResponse = await fetch("https://quadbot-rt.onrender.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
       
        localStorage.setItem("accessToken", loginData.access);
        localStorage.setItem("refreshToken", loginData.refresh);

        navigate("/chat"); 
      } else {
        if (loginData.password) {
          setErrorMessage(loginData.password[0]);
        } else if (loginData.detail) {
          setErrorMessage(loginData.detail);
        } else {
          setErrorMessage("Login failed");
        }
      }
    } catch (error) {
      setErrorMessage(error.message || "An error occurred during login");
    }
  };

  const handleCreateAccount = () => {
    navigate("/create-account"); 
  };

  return (
    <div className="auth-container">
      <img src="/logofull.png" alt="Quadspace Logo" className="auth-logo" />
      <div className="auth-form-container">
      <h1 className="auth-title">Login</h1>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        <input
          className="auth-input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="auth-input"
          type="password"
          name="password"
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
