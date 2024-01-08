// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Replace this with your actual authentication check
  const isAuthenticated = localStorage.getItem("is_superuser") === "true";
  console.log("Is Authenticated:", isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/superuser-login" />;
};

export default ProtectedRoute;
