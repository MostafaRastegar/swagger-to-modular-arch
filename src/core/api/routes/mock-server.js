// src/core/api/routes/mock-server.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validateWorkspace } = require("../middleware/validation");
const { createFieldUploadMiddleware } = require("../middleware/upload");
const workspaceService = require("../services/workspace");
const mockServerService = require("../services/mockServer");
const { MOCK_SERVER_PORT } = require("../config");

// Upload middleware for swagger file
const uploadSwaggerFile = createFieldUploadMiddleware("swaggerFile");

/**
 * Generate a mock server from Swagger spec
 */
router.post("/", uploadSwaggerFile, validateWorkspace, (req, res) => {
  try {
    console.log("Generating mock server...");
    console.log("Mock server options:", req.body);

    const workspaceId = req.query.workspaceId;
    const workspace = req.workspace; // From middleware

    // Determine which Swagger file to use
    let swaggerFilePath;
    let useDefaultFile = false;

    if (req.file) {
      // User uploaded a file, use it
      swaggerFilePath = req.file.path;
      console.log("Using uploaded Swagger file:", swaggerFilePath);
    } else if (
      workspace.defaultSwaggerFile &&
      fs.existsSync(workspace.defaultSwaggerFile.path)
    ) {
      // No file uploaded, but workspace has a default file
      swaggerFilePath = workspace.defaultSwaggerFile.path;
      useDefaultFile = true;
      console.log("Using default Swagger file:", swaggerFilePath);
    } else {
      // No file uploaded and no default file available
      return res.status(400).json({
        success: false,
        message:
          "No Swagger file uploaded and no default file available for this workspace",
      });
    }

    // Get workspace-specific server directory
    const workspaceServerDir = path.join(
      workspaceService.getWorkspaceOutputPath(workspaceId),
      "server"
    );

    // Ensure the server directory exists
    if (!fs.existsSync(workspaceServerDir)) {
      fs.mkdirSync(workspaceServerDir, { recursive: true });
    }

    // Get mock server settings from request
    const port = parseInt(req.body.port) || MOCK_SERVER_PORT;
    const enableCors = req.body.enableCors === "true";
    const generateRandomData = req.body.generateRandomData === "true";
    const dataEntryCount = parseInt(req.body.dataEntryCount) || 5;

    // Generate the mock server
    mockServerService
      .generateMockServer(swaggerFilePath, workspaceServerDir)
      .then((result) => {
        // Return relative paths for client use
        const relativeDbPath = path.relative(process.cwd(), result.dbPath);
        const relativeRoutesPath = path.relative(
          process.cwd(),
          result.routesPath
        );

        // Build the command with the specified port and CORS option
        let command = `npx json-server --watch ${relativeDbPath} --routes ${relativeRoutesPath} --port ${port}`;

        // Add the CORS option if enabled
        // if (enableCors) {
        //   command += " --middlewares cors";
        // }

        // Create README
        const swaggerContent = fs.readFileSync(swaggerFilePath, "utf8");
        const swagger = JSON.parse(swaggerContent);
        mockServerService.createMockServerReadme(
          swagger,
          workspaceServerDir,
          workspaceId,
          port
        );

        res.json({
          success: true,
          message: "Mock server generated successfully",
          dbPath: relativeDbPath,
          routesPath: relativeRoutesPath,
          endpointCount: result.endpointCount,
          workspaceId: workspaceId,
          port,
          command,
          endpoints: result.endpoints,
          usedDefaultFile: useDefaultFile,
        });
      })
      .catch((error) => {
        console.error("Error generating mock server:", error);
        res.status(500).json({
          success: false,
          message: error.message || "Failed to generate mock server",
        });
      });
  } catch (error) {
    console.error("Error generating mock server:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate mock server",
    });
  }
});

/**
 * Check if mock server is running
 */
router.get("/status", async (req, res) => {
  try {
    const status = await mockServerService.checkServerStatus();
    res.json(status);
  } catch (error) {
    res.json({
      running: false,
      message: "Error checking mock server status",
    });
  }
});

module.exports = router;
