// src/core/api/config.js
const path = require("path");

module.exports = {
  WORKSPACES_DIR:
    process.env.WORKSPACES_DIR || path.join(process.cwd(), "workspaces"),
  PORT: process.env.PORT || 3001,
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || "admin-token",
  CLEANUP_DAYS: process.env.CLEANUP_DAYS || 30,
  MOCK_SERVER_PORT: process.env.MOCK_SERVER_PORT || 3004,
  DEFAULT_FOLDER_STRUCTURE: "modules",
  TEMP_UPLOAD_DIR: path.join(process.cwd(), "uploads", "temp"),
};
