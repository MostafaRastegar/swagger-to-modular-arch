// SettingsScreen.js
import React, { useState } from "react";
import {
  Save,
  Sliders,
  Layout,
  Shield,
  Server,
  Code,
  Moon,
  Sun,
  Trash2,
  Lock,
  Paintbrush,
  Briefcase,
} from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import { useWorkspace } from "../../context/WorkspaceContext";
import Button from "../shared/Button";

const SettingsScreen = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, updateSetting, resetSettings } = useSettings();
  const { currentWorkspace, workspaces } = useWorkspace();

  const tabs = [
    { id: "workspace", label: "Workspace", icon: <Briefcase size={18} /> },
    { id: "general", label: "General", icon: <Sliders size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Paintbrush size={18} /> },
    { id: "guardian", label: "API Guardian", icon: <Shield size={18} /> },
    { id: "mockServer", label: "Mock Server", icon: <Server size={18} /> },
    { id: "codeGenerator", label: "Code Generator", icon: <Code size={18} /> },
  ];

  const handleChange = (section, setting, value) => {
    updateSetting(section, setting, value);
  };

  const handleSaveSettings = () => {
    // Settings are automatically saved to localStorage, so we just show a confirmation
    alert("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all settings to default values?"
      )
    ) {
      resetSettings();
      alert("Settings have been reset to defaults.");
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">General Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Default Output Directory
          </label>
          <input
            type="text"
            value={settings.general.defaultOutputDir}
            onChange={(e) =>
              handleChange("general", "defaultOutputDir", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showWelcomeScreen"
            checked={settings.general.showWelcomeScreen}
            onChange={(e) =>
              handleChange("general", "showWelcomeScreen", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showWelcomeScreen" className="ml-2 text-gray-700">
            Show welcome screen on startup
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoSaveSettings"
            checked={settings.general.autoSaveSettings}
            onChange={(e) =>
              handleChange("general", "autoSaveSettings", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoSaveSettings" className="ml-2 text-gray-700">
            Automatically save settings
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="confirmBeforeGeneration"
            checked={settings.general.confirmBeforeGeneration}
            onChange={(e) =>
              handleChange(
                "general",
                "confirmBeforeGeneration",
                e.target.checked
              )
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="confirmBeforeGeneration"
            className="ml-2 text-gray-700"
          >
            Confirm before code generation
          </label>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Appearance Settings</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-3">Theme</label>
          <div className="flex space-x-4">
            <div
              className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 ${
                settings.appearance.theme === "light"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleChange("appearance", "theme", "light")}
            >
              <Sun size={24} className="text-yellow-500 mb-2" />
              <span>Light</span>
            </div>

            <div
              className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 ${
                settings.appearance.theme === "dark"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleChange("appearance", "theme", "dark")}
            >
              <Moon size={24} className="text-indigo-500 mb-2" />
              <span>Dark</span>
            </div>

            <div
              className={`cursor-pointer flex flex-col items-center p-4 rounded-lg border-2 ${
                settings.appearance.theme === "system"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleChange("appearance", "theme", "system")}
            >
              <Layout size={24} className="text-gray-500 mb-2" />
              <span>System</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-3">Accent Color</label>
          <div className="flex space-x-3">
            {["blue", "purple", "green", "red", "orange"].map((color) => (
              <div
                key={color}
                className={`h-8 w-8 rounded-full cursor-pointer ${
                  settings.appearance.accentColor === color
                    ? "ring-2 ring-offset-2 ring-gray-400"
                    : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleChange("appearance", "accentColor", color)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showToolbarLabels"
            checked={settings.appearance.showToolbarLabels}
            onChange={(e) =>
              handleChange("appearance", "showToolbarLabels", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="showToolbarLabels" className="ml-2 text-gray-700">
            Show labels in toolbar
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="compactSidebar"
            checked={settings.appearance.compactSidebar}
            onChange={(e) =>
              handleChange("appearance", "compactSidebar", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="compactSidebar" className="ml-2 text-gray-700">
            Use compact sidebar
          </label>
        </div>
      </div>
    </div>
  );

  const renderGuardianSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">API Guardian Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">
            Default Report Format
          </label>
          <select
            value={settings.guardian.defaultReportFormat}
            onChange={(e) =>
              handleChange("guardian", "defaultReportFormat", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="markdown">Markdown</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Default Report Level
          </label>
          <select
            value={settings.guardian.defaultReportLevel}
            onChange={(e) =>
              handleChange("guardian", "defaultReportLevel", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Changes</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings and Critical</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoExportReport"
            checked={settings.guardian.autoExportReport}
            onChange={(e) =>
              handleChange("guardian", "autoExportReport", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="autoExportReport" className="ml-2 text-gray-700">
            Automatically export report after comparison
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeRecommendations"
            checked={settings.guardian.includeRecommendations}
            onChange={(e) =>
              handleChange(
                "guardian",
                "includeRecommendations",
                e.target.checked
              )
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="includeRecommendations"
            className="ml-2 text-gray-700"
          >
            Include recommendations in reports
          </label>
        </div>
      </div>
    </div>
  );

  const renderMockServerSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Mock Server Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Default Port</label>
          <input
            type="number"
            value={settings.mockServer.defaultPort}
            onChange={(e) =>
              handleChange(
                "mockServer",
                "defaultPort",
                parseInt(e.target.value, 10)
              )
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="enableCors"
            checked={settings.mockServer.enableCors}
            onChange={(e) =>
              handleChange("mockServer", "enableCors", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="enableCors" className="ml-2 text-gray-700">
            Enable CORS
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="generateRandomData"
            checked={settings.mockServer.generateRandomData}
            onChange={(e) =>
              handleChange("mockServer", "generateRandomData", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="generateRandomData" className="ml-2 text-gray-700">
            Generate random data instead of placeholders
          </label>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Data Entry Count (per resource)
          </label>
          <input
            type="number"
            value={settings.mockServer.dataEntryCount}
            onChange={(e) =>
              handleChange(
                "mockServer",
                "dataEntryCount",
                parseInt(e.target.value, 10)
              )
            }
            min="1"
            max="50"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderCodeGeneratorSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Code Generator Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeComments"
            checked={settings.codeGenerator.includeComments}
            onChange={(e) =>
              handleChange("codeGenerator", "includeComments", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includeComments" className="ml-2 text-gray-700">
            Include comments in generated code
          </label>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Tab Size</label>
          <select
            value={settings.codeGenerator.tabSize}
            onChange={(e) =>
              handleChange(
                "codeGenerator",
                "tabSize",
                parseInt(e.target.value, 10)
              )
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Quote Style</label>
          <select
            value={settings.codeGenerator.quoteStyle}
            onChange={(e) =>
              handleChange("codeGenerator", "quoteStyle", e.target.value)
            }
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="single">Single Quotes (')</option>
            <option value="double">Double Quotes (")</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="prettierConfig"
            checked={settings.codeGenerator.prettierConfig}
            onChange={(e) =>
              handleChange("codeGenerator", "prettierConfig", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="prettierConfig" className="ml-2 text-gray-700">
            Generate Prettier configuration
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="createIndexFiles"
            checked={settings.codeGenerator.createIndexFiles}
            onChange={(e) =>
              handleChange(
                "codeGenerator",
                "createIndexFiles",
                e.target.checked
              )
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="createIndexFiles" className="ml-2 text-gray-700">
            Create index files for exports
          </label>
        </div>
      </div>
    </div>
  );

  // Add this function to render workspace settings
  const renderWorkspaceSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Workspace Settings</h3>

      {currentWorkspace ? (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-800">Current Workspace</h4>
            <p className="text-blue-800 text-lg font-semibold mt-1">
              {currentWorkspace.name}
            </p>
            <p className="text-blue-700 text-sm mt-1">
              ID: {currentWorkspace.id}
            </p>
            <p className="text-blue-700 text-sm">
              Created: {new Date(currentWorkspace.created).toLocaleString()}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Default Generation Path</h4>
            <p className="text-gray-600 text-sm mb-2">
              This is the default path where files will be generated within your
              workspace.
            </p>
            <input
              type="text"
              value={settings.workspace?.defaultPath || ""}
              onChange={(e) =>
                handleChange("workspace", "defaultPath", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., generated"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSwitchWorkspace"
              checked={settings.workspace?.autoSwitchWorkspace}
              onChange={(e) =>
                handleChange(
                  "workspace",
                  "autoSwitchWorkspace",
                  e.target.checked
                )
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSwitchWorkspace" className="ml-2 text-gray-700">
              Automatically switch to last used workspace
            </label>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
          <Briefcase size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-700 mb-2">No workspace selected</p>
          <p className="text-gray-600 text-sm mb-4">
            Select or create a workspace to manage its settings
          </p>
          <Button
            variant="primary"
            size="small"
            onClick={() => onTabChange("workspace")}
          >
            Manage Workspaces
          </Button>
        </div>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings();
      case "appearance":
        return renderAppearanceSettings();
      case "guardian":
        return renderGuardianSettings();
      case "mockServer":
        return renderMockServerSettings();
      case "codeGenerator":
        return renderCodeGeneratorSettings();
      case "workspace":
        return renderWorkspaceSettings();

      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 flex items-center border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">{renderActiveTab()}</div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleResetSettings}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          <Trash2 size={18} className="mr-2" />
          Reset to Defaults
        </button>

        <div className="space-x-4">
          <button
            onClick={() => alert("Settings exported to JSON")}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Lock size={18} className="mr-2" />
            Export Settings
          </button>

          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save size={18} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
