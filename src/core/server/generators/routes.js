/**
 * Routes Generator
 *
 * Generates routes.json for json-server based on Swagger paths
 */

/**
 * Extract resource name from a path
 * @param {string} path - API path
 * @returns {string} Resource name
 */
function extractResourceName(path) {
  // Convert path to resource name by removing numbers and parameters
  const pathSegments = path
    .replace(/\{[^}]+\}/g, "") // Remove parameters
    .split("/")
    .filter(Boolean);

  return pathSegments.map((segment) => segment.replace(/-/g, "_")).join("_");
}

/**
 * Generate routes for json-server
 * @param {Object} paths - Swagger paths object
 * @returns {Object} Routes object for json-server
 */
function generateRoutes(paths) {
  const routes = {};

  Object.keys(paths).forEach((path) => {
    // Extract resource name using the same logic as in generateDb
    const resourceName = extractResourceName(path);

    // Detect paths with parameters (like {id})
    if (path.includes("{") && path.includes("}")) {
      // Create paths with actual IDs
      for (let i = 1; i <= 3; i++) {
        let mockPath = path;
        // Replace all parameters in the path
        const paramMatches = path.match(/{[^}]+}/g) || [];
        paramMatches.forEach((param) => {
          mockPath = mockPath.replace(param, i);
        });

        // Set route in json-server format
        routes[mockPath] = `/${resourceName}/${i}`;
      }
    } else {
      // Paths without parameters
      routes[path] = `/${resourceName}`;
    }
  });

  return routes;
}

module.exports = {
  generateRoutes,
  extractResourceName,
};
