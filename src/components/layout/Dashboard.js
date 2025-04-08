import React, { useState, useEffect } from "react";
import { Home, Code, Shield, Server, Settings } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HomeScreen from "../screens/HomeScreen";
import CodeGeneratorScreen from "../screens/CodeGeneratorScreen";
import APIGuardianScreen from "../screens/APIGuardianScreen";
import MockServerScreen from "../screens/MockServerScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useSettings } from "../../context/SettingsContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { settings } = useSettings();
  const [showWelcome, setShowWelcome] = useState(true);

  // Effect to check if we should show welcome screen
  useEffect(() => {
    setShowWelcome(settings.general.showWelcomeScreen);
  }, [settings.general.showWelcomeScreen]);

  // Menu items configuration
  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "generator", label: "Code Generator", icon: <Code size={20} /> },
    { id: "guardian", label: "API Guardian", icon: <Shield size={20} /> },
    { id: "mockServer", label: "Mock Server", icon: <Server size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Function to render the active content based on selected tab
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen onNavigate={setActiveTab} />;
      case "generator":
        return <CodeGeneratorScreen />;
      case "guardian":
        return <APIGuardianScreen />;
      case "mockServer":
        return <MockServerScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        compact={settings.appearance.compactSidebar}
        showLabels={settings.appearance.showToolbarLabels}
      />
      <div className="flex-1 overflow-auto">
        <Header
          title={
            menuItems.find((item) => item.id === activeTab)?.label ||
            "Dashboard"
          }
          showLabels={settings.appearance.showToolbarLabels}
        />
        <main className="p-6">
          {/* Only show HomeScreen on initial load if showWelcomeScreen is true */}
          {activeTab === "home" && !showWelcome
            ? renderContent("generator")
            : renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
