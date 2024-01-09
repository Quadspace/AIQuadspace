import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import AdminPage from "./pages/admin";
import SuperuserLoginForm from "./pages/superuserlogin";
import ErrorPage from "./pages/error-page";
import ProtectedRoute from "./components/ProtectedRoute";
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
        {/* Other routes */}
        <Route path="/" element={<HomePage />} />
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
      </Routes>
    </Router>
  </React.StrictMode>
);
