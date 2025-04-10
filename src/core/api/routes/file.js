// src/core/api/routes/file.js
const express = require("express");
const router = express.Router();
const fileService = require("../services/file");
const path = require("path");

/**
 * Get file or directory information
 * The path parameter is captured using wildcard (*)
 */
router.get("/:outputPath(*)", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const workspaceId = req.query.workspaceId;

    console.log("File request - Path:", outputPath);
    console.log("File request - Workspace:", workspaceId);

    try {
      // Resolve the path
      const { fullPath, relativePath } = fileService.resolveFilePath(
        outputPath,
        workspaceId
      );

      // Get file/directory info
      const fileInfo = fileService.getFileInfo(
        fullPath,
        relativePath,
        workspaceId
      );

      res.json(fileInfo);
    } catch (error) {
      const statusCode = error.message.includes("Access denied") ? 403 : 404;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        details: {
          requestedPath: outputPath,
          workspace: workspaceId,
        },
      });
    }
  } catch (error) {
    console.error("Error exploring files:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to explore files",
    });
  }
});

/**
 * Download a directory as a ZIP file
 * The path parameter is captured using wildcard (*)
 */
router.get("/download/:outputPath(*)", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const workspaceId = req.query.workspaceId;

    try {
      // Resolve the path
      const { fullPath } = fileService.resolveFilePath(outputPath, workspaceId);

      // Set archive name based on workspace and path
      const archiveName = workspaceId
        ? `ws-${workspaceId}-${path.basename(outputPath)}`
        : path.basename(outputPath);

      // Create and send zip archive
      fileService.createZipArchive(fullPath, res, archiveName);
    } catch (error) {
      const statusCode = error.message.includes("Access denied") ? 403 : 404;
      return res.status(statusCode).json({
        success: false,
        message: error.message,
        details: {
          requestedPath: outputPath,
          workspace: workspaceId,
        },
      });
    }
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create ZIP file",
    });
  }
});

module.exports = router;
