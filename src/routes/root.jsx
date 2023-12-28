// src/routes/root.jsx
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import "../index.css";

export default function Root() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <main>
      <Outlet />
    </main>
  );
}
