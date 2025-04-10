// src/core/api/services/workspace.js
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const WORKSPACES_DIR = path.join(process.cwd(), "workspaces");

// Ensure workspaces directory exists
if (!fs.existsSync(WORKSPACES_DIR)) {
  fs.mkdirSync(WORKSPACES_DIR, { recursive: true });
}

/**
 * Generate a unique 6-character uppercase share code
 * @returns {string} Share code
 */
function generateUniqueShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Creates a new workspace
 * @param {string} name - Workspace name
 * @param {string} userId - Creator user ID
 * @returns {object} Workspace information
 */
function createWorkspace(name, userId) {
  const id = uuidv4();
  const shareCode = generateUniqueShareCode();
  const workspacePath = path.join(WORKSPACES_DIR, `ws-${id}`);

  fs.mkdirSync(workspacePath, { recursive: true });
  fs.mkdirSync(path.join(workspacePath, "output"), { recursive: true });
  fs.mkdirSync(path.join(workspacePath, "uploads"), { recursive: true });

  const workspace = {
    id,
    name,
    shareCode,
    creatorId: userId,
    members: [
      {
        userId,
        role: "owner",
        status: "active",
        joinedAt: new Date().toISOString(),
      },
    ],
    created: new Date().toISOString(),
    defaultSwaggerFile: null,
  };

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
 * @param {string} userId - Optional user ID to filter workspaces
 * @returns {array} Array of workspace objects
 */
function getAllWorkspaces(userId = null) {
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

        // If userId is provided, filter workspaces accessible to this user
        if (
          !userId ||
          workspace.creatorId === userId ||
          workspace.members.some(
            (member) => member.userId === userId && member.status === "active"
          )
        ) {
          workspaces.push(workspace);
        }
      } catch (error) {
        console.error(`Error reading workspace metadata for ${entry}:`, error);
      }
    }
  }

  return workspaces;
}

/**
 * Join a workspace by share code
 * @param {string} shareCode - Share code
 * @param {string} userId - User ID
 * @returns {object} Result with workspace or error
 */
function joinWorkspaceByShareCode(shareCode, userId) {
  // Find workspace with the share code
  const workspace = getAllWorkspaces().find((ws) => ws.shareCode === shareCode);

  if (!workspace) {
    return {
      success: false,
      message: "Invalid workspace share code",
    };
  }

  // Check if user is already a member
  const existingMember = workspace.members.find(
    (member) => member.userId === userId
  );

  if (existingMember) {
    return {
      success: true,
      workspace,
      message: "Already a member of this workspace",
    };
  }

  // Add new member
  workspace.members.push({
    userId,
    role: "member",
    status: "active",
    joinedAt: new Date().toISOString(),
  });

  // Update metadata file
  const metadataPath = path.join(
    WORKSPACES_DIR,
    `ws-${workspace.id}`,
    "workspace.json"
  );
  fs.writeFileSync(metadataPath, JSON.stringify(workspace, null, 2));

  return {
    success: true,
    workspace,
    message: "Successfully joined workspace",
  };
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

/**
 * Calculate workspace size
 * @param {string} workspaceId - Workspace ID
 * @returns {number} Size in bytes
 */
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

/**
 * Set default Swagger file for a workspace
 * @param {string} workspaceId - Workspace ID
 * @param {object} fileInfo - File information
 * @returns {object} Updated workspace
 */
function setDefaultSwaggerFile(workspaceId, fileInfo) {
  const workspace = getWorkspace(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  workspace.defaultSwaggerFile = fileInfo;

  // Save updated workspace metadata
  const metadataPath = path.join(
    WORKSPACES_DIR,
    `ws-${workspaceId}`,
    "workspace.json"
  );
  fs.writeFileSync(metadataPath, JSON.stringify(workspace, null, 2));

  return workspace;
}

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

module.exports = {
  WORKSPACES_DIR,
  createWorkspace,
  getWorkspace,
  getAllWorkspaces,
  joinWorkspaceByShareCode,
  getWorkspaceUploadPath,
  getWorkspaceOutputPath,
  getWorkspaceSize,
  setDefaultSwaggerFile,
  cleanupOldWorkspaces,
  generateUniqueShareCode,
};
