// String manipulation utility functions

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

module.exports = {
  camelCase,
  pascalCase,
};
