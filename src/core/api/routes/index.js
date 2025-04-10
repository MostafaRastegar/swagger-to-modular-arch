// src/core/api/routes/index.js
const workspaceRoutes = require("./workspace");
const fileRoutes = require("./file");
const codeGenRoutes = require("./code-generator");
const mockServerRoutes = require("./mock-server");
const guardianRoutes = require("./guardian");
const adminRoutes = require("./admin");

/**
 * Setup all API routes
 * @param {object} app - Express app
 */
function setupRoutes(app) {
  // Status route - keep this simple one in the main file
  app.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      message: "API is running",
    });
  });

  // Mount all route modules
  app.use("/api/workspaces", workspaceRoutes);
  app.use("/api/files", fileRoutes);
  app.use("/api/download", fileRoutes);
  app.use("/api/generate-code", codeGenRoutes);
  app.use("/api/generate-mock-server", mockServerRoutes);
  app.use("/api/guardian", guardianRoutes);
  app.use("/api/admin", adminRoutes);

  // Documentation endpoint
  app.get("/api/docs/workspaces", (req, res) => {
    res.json({
      description: "API endpoints for workspace management",
      endpoints: [
        // Endpoint docs...
      ],
    });
  });
}

module.exports = setupRoutes;
