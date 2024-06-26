import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch("https://quadbot-rt.onrender.com/api/check_admin/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok) {
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (isAdmin === null) {

    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
