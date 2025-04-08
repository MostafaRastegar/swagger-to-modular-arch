const fs = require("fs");
const path = require("path");
const generateRoutes = require("./generateRoutes");
const generateDb = require("./generateDb");

/**
 * Generate mock server files from a Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @returns {Object} Information about the generated mock server
 */
async function generateMockServer(swaggerFilePath) {
  try {
    console.log("Generating mock server from:", swaggerFilePath);

    // Ensure server folder exists
    if (!fs.existsSync("server")) {
      fs.mkdirSync("server");
    }

    // Read and parse swagger file
    const swaggerContent = fs.readFileSync(swaggerFilePath, "utf8");
    const swagger = JSON.parse(swaggerContent);

    // Create routes.json and db.json
    const routes = generateRoutes(swagger.paths);
    const db = generateDb(swagger);

    // Save files
    fs.writeFileSync(
      path.join("server", "routes.json"),
      JSON.stringify(routes, null, 2)
    );
    fs.writeFileSync(
      path.join("server", "db.json"),
      JSON.stringify(db, null, 2)
    );

    // Create README.md
    generateReadme(swagger);

    console.log("Mock server files successfully created!");
    console.log("To run the server, enter the following command:");
    console.log(
      "npx json-server --watch server/db.json --routes server/routes.json --port 3004"
    );

    // Extract some sample endpoints for the UI
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

    // Return information about the generated server
    return {
      success: true,
      dbPath: "server/db.json",
      routesPath: "server/routes.json",
      endpointCount: Object.keys(routes).length,
      endpoints: sampleEndpoints,
      port: 3004,
      command:
        "npx json-server --watch server/db.json --routes server/routes.json --port 3004",
    };
  } catch (error) {
    console.error("Error processing swagger file:", error);
    throw error;
  }
}

// Generate README.md
function generateReadme(swagger) {
  const apiTitle = swagger.info?.title || "API";
  const readme = `# Mock Server for ${apiTitle}

## How to Use

1. Install json-server: \`npm install -g json-server\`
2. Run the server: \`json-server --watch server/db.json --routes server/routes.json --port 3004\`
3. Access the API at \`http://localhost:3004\`

## Notes
- This mock server is for development and testing purposes only
- Data resets to initial state with each restart
`;

  fs.writeFileSync(path.join("server", "README.md"), readme);
}

// If called directly from command line
if (require.main === module) {
  const swaggerPath = process.argv[2] || "./flattened-swagger.json";
  generateMockServer(swaggerPath);
}

module.exports = generateMockServer;
