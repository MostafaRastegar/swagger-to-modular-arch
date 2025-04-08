// src/App.js
import React from "react";
import Dashboard from "./components/layout/Dashboard";
import { SettingsProvider } from "./context/SettingsContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";

function App() {
  return (
    <SettingsProvider>
      <WorkspaceProvider>
        <Dashboard />
      </WorkspaceProvider>
    </SettingsProvider>
  );
}

export default App;
