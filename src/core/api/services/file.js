// src/core/api/services/file.js
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const {
  getWorkspaceUploadPath,
  getWorkspaceOutputPath,
} = require("./workspace");

/**
 * Get information about a file or directory
 * @param {string} fullPath - Path to the file or directory
 * @param {string} relativePath - Relative path from project root
 * @param {string} workspaceId - Optional workspace ID
 * @returns {object} File/directory information
 */
function getFileInfo(fullPath, relativePath, workspaceId = null) {
  const stats = fs.statSync(fullPath);

  if (stats.isFile()) {
    // If it's a file, return its content
    const content = fs.readFileSync(fullPath, "utf8");
    const extension = path.extname(fullPath).substring(1);

    return {
      success: true,
      type: "file",
      name: path.basename(fullPath),
      extension,
      content,
      size: stats.size,
      modified: stats.mtime,
      path: relativePath,
      workspaceId: workspaceId,
    };
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

    return {
      success: true,
      type: "directory",
      name: path.basename(fullPath),
      path: relativePath,
      items,
      workspaceId: workspaceId,
    };
  }

  throw new Error("Unsupported file type");
}

/**
 * Create a zip archive from a directory
 * @param {string} dirPath - Directory to archive
 * @param {object} res - Express response object
 * @param {string} archiveName - Name for the zip file
 */
function createZipArchive(dirPath, res, archiveName) {
  // Set headers for file download
  res.attachment(`${archiveName}.zip`);
  res.setHeader("Content-Type", "application/zip");

  // Create zip archive
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Maximum compression level
  });

  // Set up error handler
  archive.on("error", (err) => {
    throw err;
  });

  // Pipe archive data to the response
  archive.pipe(res);

  // Add directory contents to the archive
  archive.directory(dirPath, false);

  // Finalize the archive
  archive.finalize();
}

/**
 * Resolve file path based on workspace
 * @param {string} outputPath - Original path
 * @param {string} workspaceId - Workspace ID
 * @returns {object} Resolved path information
 */
function resolveFilePath(outputPath, workspaceId) {
  let fullPath;
  let relativePath;
  let workspacePath = null;

  if (workspaceId) {
    workspacePath = path.join(process.cwd(), "workspaces", `ws-${workspaceId}`);

    // Determine if this is an absolute or relative path
    if (outputPath.includes(`workspaces/ws-${workspaceId}`)) {
      // This is already a workspace path, use it directly
      fullPath = path.resolve(outputPath);
      relativePath = outputPath;
    } else if (outputPath.startsWith("/")) {
      // This is an absolute path to something else, which is a security risk
      throw new Error(
        "Access denied: Cannot access paths outside of workspace"
      );
    } else {
      // This is a relative path within the workspace's output directory
      fullPath = path.join(getWorkspaceOutputPath(workspaceId), outputPath);
      relativePath = path.relative(process.cwd(), fullPath);
    }

    // Additional security check - ensure path is within the workspace
    if (!fullPath.startsWith(workspacePath)) {
      throw new Error("Access denied: Path is outside workspace boundary");
    }
  } else {
    // No workspace provided, use path directly (for backward compatibility)
    console.warn("WARNING: Accessing files without a workspace ID");
    fullPath = path.resolve(outputPath);
    relativePath = outputPath;
  }

  // Ensure path exists
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Path not found: ${outputPath}`);
  }

  return {
    fullPath,
    relativePath,
    workspacePath,
  };
}

module.exports = {
  getFileInfo,
  createZipArchive,
  resolveFilePath,
};
