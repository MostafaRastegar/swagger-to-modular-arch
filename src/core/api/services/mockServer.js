// src/core/api/services/mockServer.js
const fs = require("fs");
const path = require("path");
const { getWorkspaceOutputPath } = require("./workspace");
const generateRoutes = require("../../server/generateRoutes");
const generateDb = require("../../server/generateDb");

/**
 * Generate a mock server from Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger file
 * @param {string} outputDir - Output directory
 * @returns {object} Generation result
 */
async function generateMockServer(swaggerFilePath, outputDir) {
  console.log("Generating mock server from:", swaggerFilePath);
  console.log("Output directory:", outputDir);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Read and parse swagger file
    const swaggerContent = fs.readFileSync(swaggerFilePath, "utf8");
    const swagger = JSON.parse(swaggerContent);

    // Create routes.json and db.json
    const routes = generateRoutes(swagger.paths);
    const db = generateDb(swagger);

    // Save files
    fs.writeFileSync(
      path.join(outputDir, "routes.json"),
      JSON.stringify(routes, null, 2)
    );
    fs.writeFileSync(
      path.join(outputDir, "db.json"),
      JSON.stringify(db, null, 2)
    );

    // Extract some sample endpoints for the UI
    const sampleEndpoints = extractSampleEndpoints(routes);

    return {
      success: true,
      dbPath: path.join(outputDir, "db.json"),
      routesPath: path.join(outputDir, "routes.json"),
      endpointCount: Object.keys(routes).length,
      endpoints: sampleEndpoints,
    };
  } catch (error) {
    console.error("Error processing swagger file:", error);
    throw error;
  }
}

/**
 * Extract sample endpoints for the UI
 * @param {object} routes - Routes object
 * @returns {array} Sample endpoints
 */
function extractSampleEndpoints(routes) {
  const sampleEndpoints = [];
  const routeKeys = Object.keys(routes).slice(0, 5);

  routeKeys.forEach((route) => {
    let method = "GET";
    // Try to infer method from route path
    if (route.includes("POST")) method = "POST";
    else if (route.includes("PUT")) method = "PUT";
    else if (route.includes("DELETE")) method = "DELETE";

    sampleEndpoints.push({
      path: route,
      method,
      description: `${method} ${routes[route]}`,
    });
  });

  return sampleEndpoints;
}

/**
 * Check if mock server is running
 * @returns {Promise<object>} Server status
 */
async function checkServerStatus() {
  try {
    // Simple ping to check if json-server is running
    const response = await fetch("http://localhost:3004/");

    if (response.ok) {
      return {
        running: true,
        port: 3004,
        message: "Mock server is running",
      };
    } else {
      return {
        running: false,
        message: "Mock server is not responding properly",
      };
    }
  } catch (error) {
    return {
      running: false,
      message: "Mock server is not running",
    };
  }
}

/**
 * Create README.md for the mock server
 * @param {object} swagger - Swagger object
 * @param {string} outputDir - Output directory
 * @param {string} workspaceId - Workspace ID
 */
function createMockServerReadme(swagger, outputDir, workspaceId, port = 3004) {
  const apiTitle = swagger.info?.title || "API";
  const readme = `# Mock Server for ${apiTitle}

## How to Use

1. Install json-server: \`npm install -g json-server\`
2. Run the server: \`json-server --watch ${outputDir}/db.json --routes ${outputDir}/routes.json --port ${port}\`
3. Access the API at \`http://localhost:${port}\`

## Notes
- This mock server is for development and testing purposes only
- Data resets to initial state with each restart
- Workspace ID: ${workspaceId}
`;

  fs.writeFileSync(path.join(outputDir, "README.md"), readme);
}

module.exports = {
  generateMockServer,
  checkServerStatus,
  createMockServerReadme,
  extractSampleEndpoints,
};
