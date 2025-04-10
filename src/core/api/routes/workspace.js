// src/core/api/routes/workspace.js
const express = require("express");
const fs = require("fs");
const router = express.Router();
const { validateWorkspace } = require("../middleware/validation");
const workspaceService = require("../services/workspace");
const { createFieldUploadMiddleware } = require("../middleware/upload");
const {
  parseSwaggerFile,
  extractUniqueTags,
} = require("../../parsers/swaggerParser");

// Get all workspaces
router.get("/", (req, res) => {
  try {
    const userId = req.query.userId;
    const accessibleWorkspaces = workspaceService.getAllWorkspaces(userId);

    res.json({
      success: true,
      workspaces: accessibleWorkspaces,
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch workspaces",
    });
  }
});

// Create a new workspace
router.post("/", (req, res) => {
  try {
    const { name, userId } = req.body;

    if (!name || !userId) {
      return res.status(400).json({
        success: false,
        message: "Name and userId are required",
      });
    }

    const workspace = workspaceService.createWorkspace(name, userId);

    res.json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error("Error creating workspace:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create workspace",
    });
  }
});

// Get a specific workspace
router.get("/:id", validateWorkspace, (req, res) => {
  try {
    const { id } = req.params;
    const workspace = req.workspace; // From middleware

    const sizeInBytes = workspaceService.getWorkspaceSize(id);
    const sizeInMB = Math.round((sizeInBytes / (1024 * 1024)) * 100) / 100;

    const workspaceWithSize = {
      ...workspace,
      size: {
        bytes: sizeInBytes,
        MB: sizeInMB,
      },
    };

    res.json({
      success: true,
      workspace: workspaceWithSize,
    });
  } catch (error) {
    console.error("Error getting workspace:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get workspace",
    });
  }
});

// Join workspace by share code
router.post("/join", (req, res) => {
  try {
    const { shareCode, userId } = req.body;
    const result = workspaceService.joinWorkspaceByShareCode(shareCode, userId);

    res.json(result);
  } catch (error) {
    console.error("Error joining workspace:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to join workspace",
    });
  }
});

// Set default Swagger file
router.post(
  "/:id/default-swagger",
  validateWorkspace,
  createFieldUploadMiddleware("swaggerFile"),
  (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No swagger file uploaded",
        });
      }

      // Validate Swagger file
      try {
        const swagger = parseSwaggerFile(req.file.path);

        // Create file info
        const fileInfo = {
          path: req.file.path,
          name: req.file.originalname,
          uploadedAt: new Date().toISOString(),
          endpoints: extractUniqueTags(swagger).length,
        };

        // Update workspace with default file info
        const updatedWorkspace = workspaceService.setDefaultSwaggerFile(
          id,
          fileInfo
        );

        res.json({
          success: true,
          message: "Default Swagger file set successfully",
          fileInfo: updatedWorkspace.defaultSwaggerFile,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid Swagger specification file",
          details: error.message,
        });
      }
    } catch (error) {
      console.error("Error setting default Swagger file:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to set default Swagger file",
      });
    }
  }
);

// Get default Swagger file info
router.get("/:id/default-swagger", validateWorkspace, (req, res) => {
  try {
    const workspace = req.workspace; // From middleware

    if (!workspace.defaultSwaggerFile) {
      return res.status(404).json({
        success: false,
        message: "No default Swagger file set for this workspace",
      });
    }

    res.json({
      success: true,
      defaultSwaggerFile: workspace.defaultSwaggerFile,
    });
  } catch (error) {
    console.error("Error getting default Swagger file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get default Swagger file",
    });
  }
});

// Check if default Swagger file exists
router.get("/:id/has-default-swagger", validateWorkspace, (req, res) => {
  try {
    const workspace = req.workspace; // From middleware

    const hasDefaultSwagger = Boolean(
      workspace.defaultSwaggerFile &&
        fs.existsSync(workspace.defaultSwaggerFile.path)
    );

    res.json({
      success: true,
      hasDefaultSwagger,
      defaultSwaggerFile: hasDefaultSwagger
        ? workspace.defaultSwaggerFile
        : null,
    });
  } catch (error) {
    console.error("Error checking default Swagger file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to check default Swagger file",
    });
  }
});

module.exports = router;
