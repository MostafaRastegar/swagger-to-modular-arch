import React from "react";
import Dashboard from "./components/layout/Dashboard";
import { SettingsProvider } from "./context/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <Dashboard />
    </SettingsProvider>
  );
}

export default App;
