// src/core/api/routes/admin.js
const express = require("express");
const router = express.Router();
const { validateAdminToken } = require("../middleware/validation");
const workspaceService = require("../services/workspace");
const { CLEANUP_DAYS } = require("../config");

/**
 * Clean up old workspaces
 */
router.post("/cleanup-workspaces", validateAdminToken, (req, res) => {
  try {
    const { olderThanDays } = req.body;

    const daysToKeep = parseInt(olderThanDays, 10) || CLEANUP_DAYS;
    const results = workspaceService.cleanupOldWorkspaces(daysToKeep);

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

module.exports = router;
