/**
 * String Utilities
 *
 * Utility functions for string manipulation
 */

/**
 * Convert string to camelCase
 * @param {string} str - Input string
 * @returns {string} Camel-cased string
 */
function camelCase(str) {
  if (!str) return "";
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Convert string to PascalCase
 * @param {string} str - Input string
 * @returns {string} Pascal-cased string
 */
function pascalCase(str) {
  if (!str) return "";
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

/**
 * Convert string to kebab-case
 * @param {string} str - Input string
 * @returns {string} Kebab-cased string
 */
function kebabCase(str) {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Convert string to snake_case
 * @param {string} str - Input string
 * @returns {string} Snake-cased string
 */
function snakeCase(str) {
  if (!str) return "";
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

/**
 * Safely convert a string to a valid identifier
 * @param {string} str - Input string
 * @returns {string} Valid identifier
 */
function safeIdentifier(str) {
  if (!str) return "";
  // Replace non-alphanumeric characters with underscores
  const safe = str.replace(/[^a-zA-Z0-9_]/g, "_");
  // Ensure the identifier doesn't start with a digit
  return /^\d/.test(safe) ? `_${safe}` : safe;
}

module.exports = {
  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,
  safeIdentifier,
};
