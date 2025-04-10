// src/core/api/routes/code-generator.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validateWorkspace } = require("../middleware/validation");
const { createFieldUploadMiddleware } = require("../middleware/upload");
const workspaceService = require("../services/workspace");
const { generateModules } = require("../../module-generator");
const { DEFAULT_FOLDER_STRUCTURE } = require("../config");

// Upload middleware for swagger file
const uploadSwaggerFile = createFieldUploadMiddleware("swaggerFile");

/**
 * Generate TypeScript code from Swagger specification
 */
router.post("/", uploadSwaggerFile, validateWorkspace, (req, res) => {
  try {
    console.log("Received file:", req.file);
    console.log("Received options:", req.body);
    console.log("Use default file:", req.body.useDefaultFile);

    const workspaceId = req.query.workspaceId;
    const workspace = req.workspace; // From middleware

    // Determine which Swagger file to use
    let swaggerFilePath;
    let useDefaultFile = false;

    if (req.file) {
      // User uploaded a file, use it
      swaggerFilePath = req.file.path;
    } else if (
      req.body.useDefaultFile === "true" &&
      workspace.defaultSwaggerFile &&
      fs.existsSync(workspace.defaultSwaggerFile.path)
    ) {
      // No file uploaded, but asked to use default file
      swaggerFilePath = workspace.defaultSwaggerFile.path;
      useDefaultFile = true;
      console.log("Using default Swagger file:", swaggerFilePath);
    } else {
      // No file uploaded and no default file available or not requested
      return res.status(400).json({
        success: false,
        message: "No Swagger file uploaded and no default file available",
      });
    }

    // Get workspace-specific output directory
    const workspaceOutputDir =
      workspaceService.getWorkspaceOutputPath(workspaceId);

    // Combine with user-specified subdirectory if provided
    const outputDir = req.body.outputDir
      ? path.join(workspaceOutputDir, req.body.outputDir)
      : workspaceOutputDir;

    const createFolders = req.body.createFolders === "true";
    const folderStructure =
      req.body.folderStructure || DEFAULT_FOLDER_STRUCTURE;

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate code
    generateModules(swaggerFilePath, {
      outputDir,
      createFolders,
      folderStructure,
    });

    // Return relative path for client use
    const relativePath = path.relative(process.cwd(), outputDir);

    res.json({
      success: true,
      message: "Code generated successfully",
      outputPath: relativePath,
      workspaceId: workspaceId,
      fileInfo: req.file ? req.file : workspace.defaultSwaggerFile,
      usedDefaultFile: useDefaultFile,
    });
  } catch (error) {
    console.error("Error in generate-code endpoint:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate code",
    });
  }
});

module.exports = router;
