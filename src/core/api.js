// core/api.js
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const archiver = require("archiver");
const fs = require("fs");
const path = require("path");
const { generateModules } = require("./module-generator");
const cron = require("node-cron");
const APIGuardian = require("./gardian/api-guardian");
const generateRoutes = require("./server/generateRoutes");
const generateDb = require("./server/generateDb");
const {
  parseSwaggerFile,
  extractUniqueTags,
} = require("./parsers/swaggerParser");

const app = express();
const port = process.env.PORT || 3001;

// تنظیم کراس اوریجین
app.use(cors());
app.use(express.json());

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled workspace cleanup...");
  const results = cleanupOldWorkspaces(30); // Delete workspaces older than 30 days
  console.log(`Cleaned up ${results.totalDeleted} old workspaces`);
  console.log(`Encountered ${results.totalErrors} errors during cleanup`);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get workspace ID from request
    const workspaceId = req.query.workspaceId || req.body.workspaceId;

    if (!workspaceId) {
      return cb(new Error("Workspace ID is required"));
    }

    const uploadPath = getWorkspaceUploadPath(workspaceId);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// تنظیم ذخیره‌سازی فایل‌های آپلود شده
const upload = multer({ storage });

// Update the API Guardian endpoint to be workspace-aware
app.post(
  "/api/guardian/compare-specs",
  upload.fields([
    { name: "oldSpec", maxCount: 1 },
    { name: "newSpec", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      // Check for workspace ID
      const workspaceId = req.body.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
      }

      // Validate workspace exists
      const workspace = getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      const oldSpecFile = req.files["oldSpec"][0].path;
      const newSpecFile = req.files["newSpec"][0].path;
      const reportLevel = req.body.reportLevel || "all";
      const outputFormat = req.body.outputFormat || "json";

      const guardian = new APIGuardian({ reportLevel, outputFormat });
      const report = guardian.compareSpecs(oldSpecFile, newSpecFile);

      // Save report in workspace
      const workspaceReportsDir = path.join(
        getWorkspaceOutputPath(workspaceId),
        "reports"
      );
      if (!fs.existsSync(workspaceReportsDir)) {
        fs.mkdirSync(workspaceReportsDir, { recursive: true });
      }

      const reportFilename = `api-guardian-report-${Date.now()}.json`;
      const reportPath = path.join(workspaceReportsDir, reportFilename);
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

      // Add report file path to response
      report.reportPath = path.relative(process.cwd(), reportPath);
      report.workspaceId = workspaceId;

      res.json({ report });
    } catch (error) {
      console.error("Error in compare-specs:", error);
      res.status(500).json({
        error: "Failed to compare specifications",
        details: error.message,
      });
    }
  }
);

// Update the spec validation endpoint
app.post(
  "/api/guardian/validate-spec",
  upload.single("specFile"),
  (req, res) => {
    try {
      // Check for workspace ID
      const workspaceId = req.body.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
      }

      // Validate workspace exists
      const workspace = getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
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

// In src/core/api.js - replace the files endpoint

app.get("/api/files/:outputPath(*)", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const workspaceId = req.query.workspaceId;

    console.log("File request - Path:", outputPath);
    console.log("File request - Workspace:", workspaceId);

    // If workspace ID is provided, validate and map the path
    let fullPath;
    let relativePath;

    if (workspaceId) {
      // Validate workspace
      const workspace = getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      // Map the path to the workspace directory
      const workspacePath = path.join(WORKSPACES_DIR, `ws-${workspaceId}`);

      // Determine if this is an absolute or relative path
      if (outputPath.includes(`workspaces/ws-${workspaceId}`)) {
        // This is already a workspace path, use it directly
        fullPath = path.resolve(outputPath);
        relativePath = outputPath;
      } else if (outputPath.startsWith("/")) {
        // This is an absolute path to something else, which is a security risk
        return res.status(403).json({
          success: false,
          message: "Access denied: Cannot access paths outside of workspace",
        });
      } else {
        // This is a relative path within the workspace's output directory
        fullPath = path.join(workspacePath, "output", outputPath);
        relativePath = path.relative(process.cwd(), fullPath);
      }

      // Additional security check - ensure path is within the workspace
      if (!fullPath.startsWith(workspacePath)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Path is outside workspace boundary",
        });
      }
    } else {
      // No workspace provided, use path directly (for backward compatibility)
      // This branch should be removed in production when all components use workspaces
      console.warn("WARNING: Accessing files without a workspace ID");
      fullPath = path.resolve(outputPath);
      relativePath = outputPath;
    }

    console.log("Resolved path:", fullPath);
    console.log("Relative path:", relativePath);

    // Ensure path exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "Path not found",
        details: {
          requestedPath: outputPath,
          resolvedPath: fullPath,
          workspace: workspaceId,
        },
      });
    }

    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
      // If it's a file, return its content
      const content = fs.readFileSync(fullPath, "utf8");
      const extension = path.extname(fullPath).substring(1);

      return res.json({
        success: true,
        type: "file",
        name: path.basename(fullPath),
        extension,
        content,
        size: stats.size,
        modified: stats.mtime,
        path: relativePath,
        workspaceId: workspaceId,
      });
    }

    if (stats.isDirectory()) {
      // If it's a directory, return its contents
      const items = fs.readdirSync(fullPath).map((item) => {
        const itemPath = path.join(fullPath, item);
        const itemStats = fs.statSync(itemPath);
        const isDirectory = itemStats.isDirectory();
        const itemRelativePath = path
          .relative(process.cwd(), itemPath)
          .replace(/\\/g, "/");

        return {
          name: item,
          path: itemRelativePath,
          type: isDirectory ? "directory" : "file",
          extension: isDirectory ? null : path.extname(item).substring(1),
          size: itemStats.size,
          modified: itemStats.mtime,
          workspaceId: workspaceId,
        };
      });

      // Sort: directories first, then files
      items.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === "directory" ? -1 : 1;
      });

      return res.json({
        success: true,
        type: "directory",
        name: path.basename(fullPath),
        path: relativePath,
        items,
        workspaceId: workspaceId,
      });
    }

    res.status(400).json({
      success: false,
      message: "Unsupported file type",
    });
  } catch (error) {
    console.error("Error exploring files:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to explore files",
    });
  }
});

// Update the file download endpoint
app.get("/api/download/:outputPath(*)", (req, res) => {
  try {
    const outputPath = req.params.outputPath;
    const workspaceId = req.query.workspaceId;

    console.log("Download request - Path:", outputPath);
    console.log("Download request - Workspace:", workspaceId);

    // Determine the actual path based on workspace
    let fullPath;
    let archiveName;

    if (workspaceId) {
      // Validate workspace
      const workspace = getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      // Map the path to the workspace directory
      const workspacePath = path.join(WORKSPACES_DIR, `ws-${workspaceId}`);

      // Determine if this is an absolute or relative path
      if (outputPath.includes(`workspaces/ws-${workspaceId}`)) {
        // This is already a workspace path, use it directly
        fullPath = path.resolve(outputPath);
      } else if (outputPath.startsWith("/")) {
        // This is an absolute path to something else, which is a security risk
        return res.status(403).json({
          success: false,
          message: "Access denied: Cannot access paths outside of workspace",
        });
      } else {
        // This is a relative path within the workspace's output directory
        fullPath = path.join(workspacePath, "output", outputPath);
      }

      // Additional security check - ensure path is within the workspace
      if (!fullPath.startsWith(workspacePath)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Path is outside workspace boundary",
        });
      }

      // Set archive name based on workspace and path
      archiveName = `ws-${workspaceId}-${path.basename(outputPath)}`;
    } else {
      // No workspace provided, use path directly (for backward compatibility)
      // This branch should be removed in production when all components use workspaces
      console.warn("WARNING: Downloading files without a workspace ID");
      fullPath = path.resolve(outputPath);
      archiveName = path.basename(outputPath);
    }

    console.log("Resolved path for download:", fullPath);

    // Ensure path exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({
        success: false,
        message: "Path not found for download",
        details: {
          requestedPath: outputPath,
          resolvedPath: fullPath,
          workspace: workspaceId,
        },
      });
    }

    // Set headers for file download
    res.attachment(`${archiveName}.zip`);
    res.setHeader("Content-Type", "application/zip");

    // Create zip archive
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression level
    });

    // Set up output stream
    archive.pipe(res);

    // Add directory contents to the archive
    archive.directory(fullPath, false);

    // Finalize the archive
    archive.finalize();
  } catch (error) {
    console.error("Error creating ZIP file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create ZIP file",
    });
  }
});
// Replace the existing code generation endpoint with this workspace-aware version
// In src/core/api.js - replace the generate-code endpoint

app.post("/api/generate-code", upload.single("swaggerFile"), (req, res) => {
  try {
    console.log("Received file:", req.file);
    console.log("Received options:", req.body);

    // Get and validate workspace ID
    const workspaceId = req.body.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID is required",
      });
    }

    // Validate workspace exists
    const workspace = getWorkspace(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No swagger file uploaded",
      });
    }

    // Get workspace-specific output directory
    const workspaceOutputDir = getWorkspaceOutputPath(workspaceId);

    // Combine with user-specified subdirectory if provided
    const outputDir = req.body.outputDir
      ? path.join(workspaceOutputDir, req.body.outputDir)
      : workspaceOutputDir;

    const createFolders = req.body.createFolders === "true";
    const folderStructure = req.body.folderStructure || "modules";

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate code
    generateModules(req.file.path, {
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
      fileInfo: req.file,
    });
  } catch (error) {
    console.error("Error in generate-code endpoint:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate code",
    });
  }
});

// Add to the API server file (src/core/api.js)
// Documentation endpoint for workspaces
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
      {
        path: "/api/workspaces",
        method: "POST",
        description: "Create a new workspace",
        parameters: [
          {
            name: "name",
            type: "string",
            required: true,
            description: "The name of the workspace",
          },
        ],
      },
      {
        path: "/api/workspaces/:id",
        method: "GET",
        description: "Get a specific workspace by ID",
        parameters: [
          {
            name: "id",
            type: "string",
            required: true,
            description: "The ID of the workspace",
          },
        ],
      },
      {
        path: "/api/files/:outputPath",
        method: "GET",
        description: "Get file or directory information and content",
        parameters: [
          {
            name: "outputPath",
            type: "string",
            required: true,
            description: "The path to the file or directory",
          },
          {
            name: "workspaceId",
            type: "string",
            required: false,
            description: "The ID of the workspace (optional)",
          },
        ],
      },
      {
        path: "/api/download/:outputPath",
        method: "GET",
        description: "Download a directory as a ZIP file",
        parameters: [
          {
            name: "outputPath",
            type: "string",
            required: true,
            description: "The path to the directory",
          },
          {
            name: "workspaceId",
            type: "string",
            required: false,
            description: "The ID of the workspace (optional)",
          },
        ],
      },
    ],
  });
});

// In src/core/api.js - update the generate-mock-server endpoint

app.post(
  "/api/generate-mock-server",
  upload.single("swaggerFile"),
  (req, res) => {
    try {
      console.log("Generating mock server from file:", req.file);
      console.log("Mock server options:", req.body);

      // Get and validate workspace ID
      const workspaceId = req.body.workspaceId;
      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          message: "Workspace ID is required",
        });
      }

      // Validate workspace exists
      const workspace = getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No swagger file uploaded",
        });
      }

      // Get workspace-specific server directory
      const workspaceServerDir = path.join(
        getWorkspaceOutputPath(workspaceId),
        "server"
      );

      // Ensure the server directory exists
      if (!fs.existsSync(workspaceServerDir)) {
        fs.mkdirSync(workspaceServerDir, { recursive: true });
      }

      // Mock server generation logic (modified to use workspace path)
      const generateWorkspaceMockServer = async (
        swaggerFilePath,
        outputDir
      ) => {
        try {
          console.log("Generating mock server from:", swaggerFilePath);
          console.log("Output directory:", outputDir);

          // Read and parse swagger file
          const swaggerContent = fs.readFileSync(swaggerFilePath, "utf8");
          const swagger = JSON.parse(swaggerContent);

          // Create routes.json and db.json
          const routes = generateRoutes(swagger.paths);
          const db = generateDb(swagger);

          // Save files to workspace directory
          fs.writeFileSync(
            path.join(outputDir, "routes.json"),
            JSON.stringify(routes, null, 2)
          );
          fs.writeFileSync(
            path.join(outputDir, "db.json"),
            JSON.stringify(db, null, 2)
          );

          // Create README.md for the workspace
          const apiTitle = swagger.info?.title || "API";
          const readme = `# Mock Server for ${apiTitle}

## How to Use

1. Install json-server: \`npm install -g json-server\`
2. Run the server: \`json-server --watch ${outputDir}/db.json --routes ${outputDir}/routes.json --port 3004\`
3. Access the API at \`http://localhost:3004\`

## Notes
- This mock server is for development and testing purposes only
- Data resets to initial state with each restart
- Workspace ID: ${workspaceId}
`;

          fs.writeFileSync(path.join(outputDir, "README.md"), readme);

          // Extract some sample endpoints for the UI
          const sampleEndpoints = [];
          const routeKeys = Object.keys(routes).slice(0, 5);
          routeKeys.forEach((route) => {
            let method = "GET";
            // Try to infer method from route path
            if (route.includes("POST")) method = "POST";
            else if (route.includes("PUT")) method = "PUT";
            else if (route.includes("DELETE")) method = "DELETE";

            sampleEndpoints.push({
              path: route,
              method,
              description: `${method} ${routes[route]}`,
            });
          });

          return {
            success: true,
            dbPath: path.join(outputDir, "db.json"),
            routesPath: path.join(outputDir, "routes.json"),
            endpointCount: Object.keys(routes).length,
            endpoints: sampleEndpoints,
            workspaceId: workspaceId,
          };
        } catch (error) {
          console.error("Error processing swagger file:", error);
          throw error;
        }
      };

      // Get mock server settings from request
      const port = parseInt(req.body.port) || 3004;
      const enableCors = req.body.enableCors === "true";
      const generateRandomData = req.body.generateRandomData === "true";
      const dataEntryCount = parseInt(req.body.dataEntryCount) || 5;

      // Generate the mock server in the workspace
      generateWorkspaceMockServer(req.file.path, workspaceServerDir)
        .then((result) => {
          // Return relative paths for client use
          const relativeDbPath = path.relative(process.cwd(), result.dbPath);
          const relativeRoutesPath = path.relative(
            process.cwd(),
            result.routesPath
          );

          // Build the command with the specified port and CORS option
          let command = `npx json-server --watch ${relativeDbPath} --routes ${relativeRoutesPath} --port ${port}`;

          // Add CORS if enabled
          if (enableCors) {
            command += " --middlewares cors";
          }

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
  }
);
// API for checking if mock server is running
app.get("/api/mock-server/status", (req, res) => {
  try {
    // Simple ping to check if json-server is running
    fetch("http://localhost:3004/")
      .then((response) => {
        if (response.ok) {
          res.json({
            running: true,
            port: 3004,
            message: "Mock server is running",
          });
        } else {
          res.json({
            running: false,
            message: "Mock server is not responding properly",
          });
        }
      })
      .catch(() => {
        res.json({
          running: false,
          message: "Mock server is not running",
        });
      });
  } catch (error) {
    res.json({
      running: false,
      message: "Error checking mock server status",
    });
  }
});

/**
 * Cleans up old workspaces
 * @param {number} olderThanDays - Delete workspaces older than this many days
 * @returns {object} Cleanup results
 */
function cleanupOldWorkspaces(olderThanDays = 30) {
  const results = {
    deleted: [],
    errors: [],
    totalDeleted: 0,
    totalErrors: 0,
  };

  if (!fs.existsSync(WORKSPACES_DIR)) {
    return results;
  }

  const now = Date.now();
  const timeThreshold = now - olderThanDays * 24 * 60 * 60 * 1000;

  const entries = fs.readdirSync(WORKSPACES_DIR);

  for (const entry of entries) {
    const workspacePath = path.join(WORKSPACES_DIR, entry);
    const metadataPath = path.join(workspacePath, "workspace.json");

    if (
      fs.statSync(workspacePath).isDirectory() &&
      fs.existsSync(metadataPath)
    ) {
      try {
        const workspace = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        const createdDate = new Date(workspace.created).getTime();

        // Check if workspace is older than the threshold
        if (createdDate < timeThreshold) {
          // Delete the workspace directory
          fs.rmSync(workspacePath, { recursive: true, force: true });
          results.deleted.push(workspace.id);
          results.totalDeleted++;
        }
      } catch (error) {
        console.error(`Error cleaning up workspace ${entry}:`, error);
        results.errors.push(entry);
        results.totalErrors++;
      }
    }
  }

  return results;
}

// Add an admin endpoint for cleanup
app.post("/api/admin/cleanup-workspaces", (req, res) => {
  try {
    const { olderThanDays, adminToken } = req.body;

    // Very basic authentication
    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const daysToKeep = parseInt(olderThanDays, 10) || 30;
    const results = cleanupOldWorkspaces(daysToKeep);

    res.json({
      success: true,
      message: `Cleaned up ${results.totalDeleted} old workspaces`,
      results,
    });
  } catch (error) {
    console.error("Error cleaning up workspaces:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to clean up workspaces",
    });
  }
});

// Add these workspace-related functions
const WORKSPACES_DIR = path.join(process.cwd(), "workspaces");

// Ensure workspaces directory exists
if (!fs.existsSync(WORKSPACES_DIR)) {
  fs.mkdirSync(WORKSPACES_DIR, { recursive: true });
}

/**
 * Creates a new workspace
 * @param {string} name - Workspace name
 * @returns {object} Workspace information
 */
function createWorkspace(name) {
  const id = uuidv4();
  const workspacePath = path.join(WORKSPACES_DIR, `ws-${id}`);

  // Create workspace directory and subdirectories
  fs.mkdirSync(workspacePath, { recursive: true });
  fs.mkdirSync(path.join(workspacePath, "output"), { recursive: true });
  fs.mkdirSync(path.join(workspacePath, "uploads"), { recursive: true });

  const workspace = {
    id,
    name,
    path: workspacePath,
    created: new Date().toISOString(),
  };

  // Save workspace metadata
  const metadataPath = path.join(workspacePath, "workspace.json");
  fs.writeFileSync(metadataPath, JSON.stringify(workspace, null, 2));

  return workspace;
}

/**
 * Gets a workspace by ID
 * @param {string} id - Workspace ID
 * @returns {object|null} Workspace information or null if not found
 */
function getWorkspace(id) {
  const workspacePath = path.join(WORKSPACES_DIR, `ws-${id}`);
  const metadataPath = path.join(workspacePath, "workspace.json");

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
}

/**
 * Gets all workspaces
 * @returns {array} Array of workspace objects
 */
function getAllWorkspaces() {
  const workspaces = [];

  if (!fs.existsSync(WORKSPACES_DIR)) {
    return workspaces;
  }

  const entries = fs.readdirSync(WORKSPACES_DIR);

  for (const entry of entries) {
    const workspacePath = path.join(WORKSPACES_DIR, entry);
    const metadataPath = path.join(workspacePath, "workspace.json");

    if (
      fs.statSync(workspacePath).isDirectory() &&
      fs.existsSync(metadataPath)
    ) {
      try {
        const workspace = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        workspaces.push(workspace);
      } catch (error) {
        console.error(`Error reading workspace metadata for ${entry}:`, error);
      }
    }
  }

  return workspaces;
}

/**
 * Gets the workspace upload path
 * @param {string} workspaceId - Workspace ID
 * @returns {string} Path to the workspace uploads directory
 */
function getWorkspaceUploadPath(workspaceId) {
  return path.join(WORKSPACES_DIR, `ws-${workspaceId}`, "uploads");
}

/**
 * Gets the workspace output path
 * @param {string} workspaceId - Workspace ID
 * @returns {string} Path to the workspace output directory
 */
function getWorkspaceOutputPath(workspaceId) {
  return path.join(WORKSPACES_DIR, `ws-${workspaceId}`, "output");
}

// Create a new workspace
app.post("/api/workspaces", (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required",
      });
    }

    const workspace = createWorkspace(name);

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

// Get all workspaces
app.get("/api/workspaces", (req, res) => {
  try {
    const workspaces = getAllWorkspaces();

    res.json({
      success: true,
      workspaces,
    });
  } catch (error) {
    console.error("Error getting workspaces:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get workspaces",
    });
  }
});

// Get a specific workspace
app.get("/api/workspaces/:id", (req, res) => {
  try {
    const { id } = req.params;
    const workspace = getWorkspace(id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Calculate workspace size
    const sizeInBytes = getWorkspaceSize(id);
    const sizeInMB = Math.round((sizeInBytes / (1024 * 1024)) * 100) / 100;

    // Include size in the response
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

// Add to src/core/api.js
const validateWorkspace = (req, res, next) => {
  const workspaceId =
    req.body.workspaceId || req.query.workspaceId || req.params.workspaceId;

  if (!workspaceId) {
    return res.status(400).json({
      success: false,
      message: "Workspace ID is required",
    });
  }

  const workspace = getWorkspace(workspaceId);
  if (!workspace) {
    return res.status(404).json({
      success: false,
      message: "Workspace not found",
    });
  }

  // Add workspace to request object for use in route handlers
  req.workspace = workspace;
  next();
};

// Use the middleware for relevant routes
app.get("/api/workspaces/:id", validateWorkspace, (req, res) => {
  // Now req.workspace is available
  res.json({
    success: true,
    workspace: req.workspace,
  });
});

function getWorkspaceSize(workspaceId) {
  const workspacePath = path.join(WORKSPACES_DIR, `ws-${workspaceId}`);

  if (!fs.existsSync(workspacePath)) {
    return 0;
  }

  // Recursive function to calculate directory size
  const calculateSize = (dirPath) => {
    let size = 0;
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        size += calculateSize(itemPath);
      } else {
        size += stats.size;
      }
    }

    return size;
  };

  return calculateSize(workspacePath);
}

// افزودن مسیری برای آزمودن وضعیت API
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "API is running",
  });
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
  console.log(`Test API status: http://localhost:${port}/api/status`);
});
