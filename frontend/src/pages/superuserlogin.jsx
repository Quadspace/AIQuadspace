import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperuserLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform authentication (this is a simplified example)
    if (username === "admin" && password === "safepass1") {
      // Set authentication status
      localStorage.setItem("is_superuser", "true");
      navigate("/admin"); // Redirect to the admin panel
    } else {
      // Handle incorrect credentials
      alert("Incorrect username or password");
    }
  };
  console.log("Rendering SuperuserLoginForm");

  return (
    <div>
      <h2>Superuser Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SuperuserLoginForm;
