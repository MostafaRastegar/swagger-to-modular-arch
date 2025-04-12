// src/core/api.js
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { PORT, CLEANUP_DAYS } = require("./api/config");
const workspaceService = require("./api/services/workspace");

// Import routes
const workspaceRoutes = require("./api/routes/workspace");
const fileRoutes = require("./api/routes/file");
const downloadRoutes = require("./api/routes/file"); // Using the same file router
const codeGenRoutes = require("./api/routes/code-generator");
const mockServerRoutes = require("./api/routes/mock-server");
const guardianRoutes = require("./api/routes/guardian");
const adminRoutes = require("./api/routes/admin");

const app = express();

// Setup middleware
app.use(cors());
app.use(express.json());

// Setup scheduled jobs
cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled workspace cleanup...");
  const results = workspaceService.cleanupOldWorkspaces(CLEANUP_DAYS);
  console.log(`Cleaned up ${results.totalDeleted} old workspaces`);
  console.log(`Encountered ${results.totalErrors} errors during cleanup`);
});

// Basic status route directly in main file
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
  });
});

// Documentation endpoint
app.get("/api/docs/workspaces", (req, res) => {
  res.json({
    description: "API endpoints for workspace management",
    endpoints: [
      {
        path: "/api/workspaces",
        method: "GET",
        description: "Get all workspaces",
        parameters: [],
      },
      // Other endpoint docs...
    ],
  });
});

// Mount all routes
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/generate-code", codeGenRoutes);
app.use("/api/generate-mock-server", mockServerRoutes);
app.use("/api/guardian", guardianRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mock-server", mockServerRoutes); // Mounting the mock-server routes again for /api/mock-server/status

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Test API status: http://localhost:${PORT}/api/status`);
});
