/**
 * Database Generator
 *
 * Generates mock database (db.json) for json-server based on Swagger definitions
 */
const { extractResourceName } = require("./routes");
const { generateDataFromSchema } = require("../utils/data-generator");

/**
 * Generate mock database
 * @param {Object} swagger - Swagger document
 * @param {Object} options - Generation options
 * @param {number} options.entryCount - Number of entries per resource
 * @returns {Object} Database object for json-server
 */
function generateDatabase(swagger, options = {}) {
  const entryCount = options.entryCount || 5;
  const db = {};
  const routes = extractRoutes(swagger);

  routes.forEach((route) => {
    const resourceName = extractResourceName(route.path);
    const responseSchema = findResponseSchema(swagger, route);

    if (responseSchema) {
      db[resourceName] = generateDataFromSchema(responseSchema, entryCount);
    }
  });

  return db;
}

/**
 * Extract routes from Swagger document
 * @param {Object} swagger - Swagger document
 * @returns {Array} Array of routes
 */
function extractRoutes(swagger) {
  const routes = [];

  for (const [path, methods] of Object.entries(swagger.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      routes.push({ path, method, details });
    }
  }

  return routes;
}

/**
 * Find response schema for a route
 * @param {Object} swagger - Swagger document
 * @param {Object} route - Route object
 * @returns {Object|null} Response schema or null if not found
 */
function findResponseSchema(swagger, route) {
  const responses = route.details.responses;

  // Priority given to 200 or 201 responses
  const successCodes = ["200", "201"];

  for (const code of successCodes) {
    if (responses[code] && responses[code].content) {
      const contentType = Object.keys(responses[code].content)[0];
      return responses[code].content[contentType].schema;
    }
  }

  return null;
}

module.exports = {
  generateDatabase,
  extractRoutes,
  findResponseSchema,
};
