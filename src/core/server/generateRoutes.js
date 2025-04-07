// Generate routes.json from swagger paths
function extractResourceName(path) {
  // Convert path to resource name by removing numbers and parameters
  const pathSegments = path
    .replace(/\{[^}]+\}/g, "") // Remove parameters
    .split("/")
    .filter(Boolean);

  return pathSegments.map((segment) => segment.replace(/-/g, "_")).join("_");
}

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

module.exports = generateRoutes;
