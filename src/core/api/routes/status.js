// src/core/api/routes/status.js
function setupStatusRoutes(app) {
  // API status endpoint
  app.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      message: "API is running",
    });
  });

  // API documentation endpoint
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
        // ... other endpoint documentation
      ],
    });
  });
}

module.exports = setupStatusRoutes;
