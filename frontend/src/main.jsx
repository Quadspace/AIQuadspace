// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home-page";
import AdminPage from "./pages/admin";
import SuperuserLoginForm from "./pages/superuserlogin";
import ErrorPage from "./pages/error-page";
import "./index.css";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Directly placing SuperuserLoginForm in the routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="superuser-login" element={<SuperuserLoginForm />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
