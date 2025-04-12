// src/core/api/middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getWorkspaceUploadPath } = require("../services/workspace");

/**
 * Configure storage for workspace-aware file uploads
 */
const workspaceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get workspace ID from request
    const workspaceId = req.query.workspaceId;

    if (!workspaceId) {
      // If not in query params, use a temporary directory
      console.warn(
        "Warning: No workspace ID provided in query for file upload"
      );
      const tempUploadPath = path.join(process.cwd(), "uploads", "temp");

      if (!fs.existsSync(tempUploadPath)) {
        fs.mkdirSync(tempUploadPath, { recursive: true });
      }

      return cb(null, tempUploadPath);
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

/**
 * Create workspace-aware multer upload middleware
 * @param {object} options - Upload options
 * @returns {object} Configured multer middleware
 */
function createUploadMiddleware(options = {}) {
  return multer({
    storage: workspaceStorage,
    limits: options.limits,
  });
}

/**
 * Create workspace-aware upload middleware for a specific field
 * @param {string} fieldName - Form field name
 * @returns {function} Multer middleware
 */
function createFieldUploadMiddleware(fieldName) {
  return createUploadMiddleware().single(fieldName);
}

module.exports = {
  createUploadMiddleware,
  createFieldUploadMiddleware,
  workspaceStorage,
};
