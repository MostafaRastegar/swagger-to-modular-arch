// src/contexts/SettingsContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  applyTheme,
  applyAccentColor,
  initializeTheme,
} from "../utils/themeUtils";

// Default settings structure
// Default settings structure
const defaultSettings = {
  general: {
    defaultOutputDir: "src/modules",
    showWelcomeScreen: true,
    autoSaveSettings: true,
    confirmBeforeGeneration: true,
  },
  appearance: {
    theme: "light",
    accentColor: "blue",
    showToolbarLabels: true,
    compactSidebar: false,
  },
  guardian: {
    defaultReportFormat: "markdown",
    defaultReportLevel: "all",
    autoExportReport: false,
    includeRecommendations: true,
  },
  mockServer: {
    defaultPort: 3004,
    enableCors: true,
    generateRandomData: true,
    dataEntryCount: 5,
  },
  codeGenerator: {
    includeComments: true,
    tabSize: 2,
    quoteStyle: "single",
    prettierConfig: true,
    createIndexFiles: true,
  },
};

// Actions
const INITIALIZE_SETTINGS = "INITIALIZE_SETTINGS";
const UPDATE_SETTINGS = "UPDATE_SETTINGS";
const RESET_SETTINGS = "RESET_SETTINGS";

// Reducer function
function settingsReducer(state, action) {
  switch (action.type) {
    case INITIALIZE_SETTINGS:
      return action.payload || defaultSettings;
    case UPDATE_SETTINGS:
      const { section, setting, value } = action.payload;
      return {
        ...state,
        [section]: {
          ...state[section],
          [setting]: value,
        },
      };
    case RESET_SETTINGS:
      return defaultSettings;
    default:
      return state;
  }
}

// Create context
const SettingsContext = createContext();

// Provider component
export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem("appSettings");
        if (savedSettings) {
          dispatch({
            type: INITIALIZE_SETTINGS,
            payload: JSON.parse(savedSettings),
          });
        }

        // Initialize theme (will use default if not set)
        initializeTheme();
      } catch (error) {
        console.error("Error loading settings from localStorage:", error);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [settings]);

  // Apply appearance settings when they change
  useEffect(() => {
    // Apply theme
    applyTheme(settings.appearance.theme);

    // Apply accent color
    applyAccentColor(settings.appearance.accentColor);

    // Apply other appearance settings if needed
    // ...
  }, [settings.appearance.theme, settings.appearance.accentColor]);
  // Actions
  const updateSetting = (section, setting, value) => {
    dispatch({
      type: UPDATE_SETTINGS,
      payload: { section, setting, value },
    });
  };

  const resetSettings = () => {
    dispatch({ type: RESET_SETTINGS });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
