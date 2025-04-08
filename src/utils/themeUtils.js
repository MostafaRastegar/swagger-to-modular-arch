// src/utils/themeUtils.js

/**
 * Applies the theme to the document's root element
 * @param {string} theme - "light", "dark" or "system"
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Remove any existing theme classes
  root.classList.remove("theme-light", "theme-dark");

  if (theme === "system") {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.add(prefersDark ? "theme-dark" : "theme-light");
  } else {
    root.classList.add(`theme-${theme}`);
  }

  // Update localStorage directly for faster access without context
  localStorage.setItem("theme", theme);
};

/**
 * Applies accent color to the document
 * @param {string} color - Accent color name (e.g., "blue", "green")
 */
export const applyAccentColor = (color) => {
  const root = document.documentElement;

  // Remove existing accent color classes
  const existingClasses = Array.from(root.classList).filter((cls) =>
    cls.startsWith("accent-")
  );

  existingClasses.forEach((cls) => {
    root.classList.remove(cls);
  });

  // Add the new accent color class
  root.classList.add(`accent-${color}`);

  // Update localStorage directly
  localStorage.setItem("accentColor", color);
};

/**
 * Initialize theme from saved settings or system preference
 */
export const initializeTheme = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("theme");
  const savedAccentColor = localStorage.getItem("accentColor");

  // Apply theme
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Default to system preference
    applyTheme("system");
  }

  // Apply accent color
  if (savedAccentColor) {
    applyAccentColor(savedAccentColor);
  } else {
    // Default to blue
    applyAccentColor("blue");
  }
};
