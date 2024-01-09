import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isSuperuser = localStorage.getItem("isSuperuser") === "true";

  return isSuperuser ? children : <Navigate to="/superuser-login" />;
};

export default ProtectedRoute;
