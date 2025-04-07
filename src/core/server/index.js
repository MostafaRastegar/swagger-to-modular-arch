const fs = require("fs");
const path = require("path");
const generateRoutes = require("./generateRoutes");
const generateDb = require("./generateDb");

// Ensure server folder exists
if (!fs.existsSync("server")) {
  fs.mkdirSync("server");
}

// Read swagger.json file
async function generateMockServer(swaggerFilePath) {
  try {
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
  } catch (error) {
    console.error("Error processing swagger file:", error);
  }
}

// Generate README.md
function generateReadme(swagger) {
  const apiTitle = swagger.info.title || "API";
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

// Get swagger.json file path from command line argument
const swaggerPath = process.argv[2] || "./flattened-swagger.json";
generateMockServer(swaggerPath);

module.exports = generateMockServer;
