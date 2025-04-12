/**
 * Mock Server Generator
 *
 * Creates a mock server from a Swagger/OpenAPI specification using json-server
 */

const fs = require("fs");
const path = require("path");
const { parseSwaggerFile } = require("../code-generator/parsers/swagger");
const { generateRoutes } = require("./generators/routes");
const { generateDatabase } = require("./generators/database");
const { generateReadme } = require("./generators/readme");

/**
 * Generate mock server files from a Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {Object} options - Configuration options
 * @param {string} options.outputDir - Output directory for server files
 * @param {number} options.port - Server port (default: 3004)
 * @param {number} options.entryCount - Number of entries per resource (default: 5)
 * @param {boolean} options.enableCors - Whether to enable CORS (default: true)
 * @param {string} options.workspaceId - Optional workspace ID for workspaces feature
 * @returns {Object} Information about the generated mock server
 */
async function generateMockServer(swaggerFilePath, options = {}) {
  try {
    const port = options.port || 3004;
    const entryCount = options.entryCount || 5;
    const outputDir = options.outputDir || "server";

    console.log("Generating mock server from:", swaggerFilePath);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Configuration: Port=${port}, Entries=${entryCount}`);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      console.log("Creating output directory:", outputDir);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read and parse swagger file
    console.log("Parsing Swagger file...");
    const swagger = parseSwaggerFile(swaggerFilePath);

    // Create routes.json and db.json
    console.log("Generating routes...");
    const routes = generateRoutes(swagger.paths);

    console.log("Generating mock database...");
    const db = generateDatabase(swagger, { entryCount });

    // Determine file paths
    const dbPath = path.join(outputDir, "db.json");
    const routesPath = path.join(outputDir, "routes.json");
    const readmePath = path.join(outputDir, "README.md");

    // Save files
    console.log("Writing routes to:", routesPath);
    fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2));

    console.log("Writing database to:", dbPath);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // Generate README
    console.log("Generating README...");
    const readmeContent = generateReadme(swagger, {
      port,
      dbPath,
      routesPath,
      workspaceId: options.workspaceId,
    });

    fs.writeFileSync(readmePath, readmeContent);

    // Build the command with options
    let command = `npx json-server --watch ${dbPath} --routes ${routesPath} --port ${port}`;

    if (options.enableCors !== false) {
      command +=
        " --middlewares ./node_modules/json-server/lib/server/middlewares/cors.js";
    }

    console.log("Mock server files successfully created!");
    console.log("To run the server, enter the following command:");
    console.log(command);

    // Extract some sample endpoints for the UI
    const sampleEndpoints = extractSampleEndpoints(routes, swagger);

    // Return information about the generated server
    return {
      success: true,
      dbPath,
      routesPath,
      readmePath,
      endpointCount: Object.keys(routes).length,
      endpoints: sampleEndpoints,
      port,
      command,
      workspaceId: options.workspaceId,
    };
  } catch (error) {
    console.error("Error generating mock server:", error);
    throw new Error(`Failed to generate mock server: ${error.message}`);
  }
}

/**
 * Extract sample endpoints for UI
 * @param {Object} routes - Generated routes
 * @param {Object} swagger - Swagger document
 * @returns {Array} Sample endpoints with method, path and description
 */
function extractSampleEndpoints(routes, swagger) {
  const sampleEndpoints = [];
  const routeKeys = Object.keys(routes).slice(0, 5);

  routeKeys.forEach((route) => {
    let method = "GET";
    let description = "No description available";

    // Try to infer method from route path
    if (route.includes("POST")) method = "POST";
    else if (route.includes("PUT")) method = "PUT";
    else if (route.includes("DELETE")) method = "DELETE";

    // Try to get description from Swagger
    try {
      const originalPath = route.replace(/\/\d+/g, "/{id}");
      const methodLower = method.toLowerCase();
      if (
        swagger.paths[originalPath] &&
        swagger.paths[originalPath][methodLower]
      ) {
        description =
          swagger.paths[originalPath][methodLower].summary ||
          swagger.paths[originalPath][methodLower].description ||
          description;
      }
    } catch (err) {
      // Ignore error, use default description
    }

    sampleEndpoints.push({
      path: route,
      method,
      description: `${description}`,
    });
  });

  return sampleEndpoints;
}

// If called directly from command line
if (require.main === module) {
  const swaggerPath = process.argv[2] || "./swagger.json";
  generateMockServer(swaggerPath);
}

module.exports = generateMockServer;
