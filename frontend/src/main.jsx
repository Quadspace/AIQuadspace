import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import AdminPage from "./pages/admin";
import ErrorPage from "./pages/error-page";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/login-page";
import CreateAccountPage from "./pages/createaccountpage";
import "./index.css";

// Function to clear authentication state
const clearAuthState = () => {
  localStorage.removeItem("isSuperuser"); // Replace 'isSuperuser' with your actual auth flag
};

// Clear authentication state on app load
clearAuthState();

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
