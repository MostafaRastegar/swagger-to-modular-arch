// Add to src/utils/pathUtils.js (new file)

/**
 * Utility functions for managing workspace paths
 */

/**
 * Converts a path to be workspace-aware with the proper format
 * @param {string} path - The path to convert
 * @param {string} workspaceId - The workspace ID
 * @returns {string} The URL with workspace parameter
 */
export const getWorkspaceAwarePath = (path, workspaceId) => {
  if (!path) return "";

  // Build URL with workspace ID if provided
  let url = path;

  // Add ? or & depending on whether the URL already has query parameters
  const separator = url.includes("?") ? "&" : "?";

  if (workspaceId) {
    url += `${separator}workspaceId=${workspaceId}`;
  }

  return url;
};

/**
 * Builds a full API URL with workspace ID
 * @param {string} endpoint - The API endpoint
 * @param {string} workspaceId - The workspace ID
 * @returns {string} The complete URL with workspace parameter
 */
export const buildApiUrl = (endpoint, workspaceId) => {
  const baseUrl = "http://localhost:3001";
  const fullEndpoint = `${baseUrl}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  return getWorkspaceAwarePath(fullEndpoint, workspaceId);
};
