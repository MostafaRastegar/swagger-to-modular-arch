// src/components/layout/Header.js
import React from "react";
import { Moon, Sun, Settings } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import WorkspaceSelector from "../workspace/WorkspaceSelector";

const Header = ({ title }) => {
  const { settings, updateSetting } = useSettings();

  const toggleTheme = () => {
    const newTheme = settings.appearance.theme === "light" ? "dark" : "light";
    updateSetting("appearance", "theme", newTheme);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-700 mr-4">{title}</h2>
          <div className="ml-4 w-64">
            <WorkspaceSelector />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="text-gray-500 hover:text-gray-700"
            title={
              settings.appearance.theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode"
            }
          >
            {settings.appearance.theme === "light" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
