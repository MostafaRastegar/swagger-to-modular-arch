/**
 * README Generator
 *
 * Generates README.md for the mock server with usage instructions
 */

/**
 * Generate README content
 * @param {Object} swagger - Swagger document
 * @param {Object} options - Generation options
 * @param {number} options.port - Server port
 * @param {string} options.dbPath - Path to database file
 * @param {string} options.routesPath - Path to routes file
 * @param {string} options.workspaceId - Optional workspace ID
 * @returns {string} README content
 */
function generateReadme(swagger, options = {}) {
  const port = options.port || 3004;
  const dbPath = options.dbPath || "server/db.json";
  const routesPath = options.routesPath || "server/routes.json";
  const apiTitle = swagger.info?.title || "API";
  const workspaceInfo = options.workspaceId
    ? `\nWorkspace ID: ${options.workspaceId}`
    : "";

  return `# Mock Server for ${apiTitle}

## How to Use

1. Install json-server: \`npm install -g json-server\`
2. Run the server: \`json-server --watch ${dbPath} --routes ${routesPath} --port ${port}\`
3. Access the API at \`http://localhost:${port}\`

## Notes
- This mock server is for development and testing purposes only
- Data resets to initial state with each restart${workspaceInfo}

## Available Endpoints

The following endpoints are available from the mock server:

${generateEndpointsList(swagger)}

## Generated Data

The mock server generates realistic test data based on your API specifications. You can:

- Use GET requests to retrieve data
- Use POST requests to create new data
- Use PUT requests to update existing data
- Use DELETE requests to remove data

Note that changes are not persisted after server restart.
`;
}

/**
 * Generate a list of endpoints from Swagger
 * @param {Object} swagger - Swagger document
 * @returns {string} Markdown list of endpoints
 */
function generateEndpointsList(swagger) {
  if (!swagger.paths || Object.keys(swagger.paths).length === 0) {
    return "No endpoints available.";
  }

  let endpointsList = "";

  // Limit to 10 endpoints to avoid too long README
  const paths = Object.keys(swagger.paths).slice(0, 10);

  paths.forEach((path) => {
    const methods = swagger.paths[path];
    for (const method in methods) {
      if (
        method.toLowerCase() === "get" ||
        method.toLowerCase() === "post" ||
        method.toLowerCase() === "put" ||
        method.toLowerCase() === "delete"
      ) {
        const operation = methods[method];
        endpointsList += `- \`${method.toUpperCase()} ${path}\` - ${
          operation.summary || "No description"
        }\n`;
      }
    }
  });

  if (Object.keys(swagger.paths).length > 10) {
    endpointsList += `\n... and ${
      Object.keys(swagger.paths).length - 10
    } more endpoints.`;
  }

  return endpointsList;
}

module.exports = {
  generateReadme,
};
