import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import APIGuardianDashboard from "./gardian/APIGuardianDashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <APIGuardianDashboard />
  </React.StrictMode>
);
