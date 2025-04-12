// src/App.js
import React from "react";
import Dashboard from "./components/layout/Dashboard";
import { SettingsProvider } from "./context/SettingsContext";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <WorkspaceProvider>
          <Dashboard />
        </WorkspaceProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
