// src/core/api/routes/guardian.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { validateWorkspace } = require("../middleware/validation");
const { createUploadMiddleware } = require("../middleware/upload");
const workspaceService = require("../services/workspace");
const APIGuardian = require("../../guardian");
const {
  parseSwaggerFile,
  extractUniqueTags,
} = require("../../parsers/swaggerParser");

// Configure upload middleware for multiple files
const guardianUpload = createUploadMiddleware().fields([
  { name: "oldSpec", maxCount: 1 },
  { name: "newSpec", maxCount: 1 },
]);

const singleFileUpload = createUploadMiddleware().single("specFile");

/**
 * Compare two Swagger/OpenAPI specs for breaking changes
 */
router.post("/compare-specs", guardianUpload, validateWorkspace, (req, res) => {
  try {
    const workspaceId = req.query.workspaceId;
    const workspace = req.workspace; // From middleware

    // Determine file paths based on uploads and default settings
    let oldSpecFile, newSpecFile;
    let usedDefaultFile = false;

    // Check if we should use the default file
    const useDefaultForOld = req.body.useDefaultForOld === "true";
    const useDefaultForNew = req.body.useDefaultForNew === "true";

    if (req.files["oldSpec"] && req.files["oldSpec"][0]) {
      // User uploaded an old spec file
      oldSpecFile = req.files["oldSpec"][0].path;
    } else if (
      useDefaultForOld &&
      workspace.defaultSwaggerFile &&
      fs.existsSync(workspace.defaultSwaggerFile.path)
    ) {
      // Use default file for old spec
      oldSpecFile = workspace.defaultSwaggerFile.path;
      usedDefaultFile = true;
      console.log("Using default file for old spec:", oldSpecFile);
    } else {
      return res.status(400).json({
        success: false,
        message: "Old specification file is required",
      });
    }

    if (req.files["newSpec"] && req.files["newSpec"][0]) {
      // User uploaded a new spec file
      newSpecFile = req.files["newSpec"][0].path;
    } else if (
      useDefaultForNew &&
      workspace.defaultSwaggerFile &&
      fs.existsSync(workspace.defaultSwaggerFile.path)
    ) {
      // Use default file for new spec
      newSpecFile = workspace.defaultSwaggerFile.path;
      usedDefaultFile = true;
      console.log("Using default file for new spec:", newSpecFile);
    } else {
      return res.status(400).json({
        success: false,
        message: "New specification file is required",
      });
    }

    const reportLevel = req.body.reportLevel || "all";
    const outputFormat = req.body.outputFormat || "json";

    const guardian = new APIGuardian({ reportLevel, outputFormat });
    const report = guardian.compareSpecs(oldSpecFile, newSpecFile);

    // Save report in workspace
    const workspaceReportsDir = path.join(
      workspaceService.getWorkspaceOutputPath(workspaceId),
      "reports"
    );
    if (!fs.existsSync(workspaceReportsDir)) {
      fs.mkdirSync(workspaceReportsDir, { recursive: true });
    }

    const reportFilename = `api-guardian-report-${Date.now()}.json`;
    const reportPath = path.join(workspaceReportsDir, reportFilename);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Add report file path and workspace info to response
    report.reportPath = path.relative(process.cwd(), reportPath);
    report.workspaceId = workspaceId;
    report.usedDefaultFile = usedDefaultFile;

    res.json({ report });
  } catch (error) {
    console.error("Error in compare-specs:", error);
    res.status(500).json({
      error: "Failed to compare specifications",
      details: error.message,
    });
  }
});

/**
 * Validate a Swagger/OpenAPI specification file
 */
router.post(
  "/validate-spec",
  singleFileUpload,
  validateWorkspace,
  (req, res) => {
    try {
      const workspaceId = req.query.workspaceId;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No specification file uploaded",
        });
      }

      const specFile = req.file.path;

      // Validate the file
      const swagger = parseSwaggerFile(specFile);

      res.json({
        valid: true,
        endpoints: extractUniqueTags(swagger).length,
        message: "Specification file is valid",
        workspaceId: workspaceId,
      });
    } catch (error) {
      console.error("Error validating spec:", error);
      res.status(400).json({
        valid: false,
        error: "Invalid specification file",
        details: error.message,
      });
    }
  }
);

module.exports = router;
