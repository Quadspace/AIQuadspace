// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ErrorPage from "./pages/error-page";
import Root from "./routes/root";
import HomePage from "./pages/home-page";
import AdminPage from "./pages/admin";
import SuperuserLoginForm from "./pages/superuserlogin"; // Ensure this is the correct import path
import "./index.css";

// Step 1: Create the root
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// Step 2: Call render with your component tree (without passing the container again)
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="home" element={<HomePage />} />
          <Route path="superuser-login" element={<SuperuserLoginForm />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
