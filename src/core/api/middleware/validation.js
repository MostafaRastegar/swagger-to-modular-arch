// src/core/api/middleware/validation.js
const { getWorkspace } = require("../services/workspace");

/**
 * Middleware to validate workspace existence
 */
function validateWorkspace(req, res, next) {
  const workspaceId =
    req.body.workspaceId || req.query.workspaceId || req.params.id;

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
}

/**
 * Middleware to validate admin token
 */
function validateAdminToken(req, res, next) {
  const { adminToken } = req.body;

  // Very basic authentication
  if (adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}

module.exports = {
  validateWorkspace,
  validateAdminToken,
};
