// src/adapters/mockServerAdapter.js

export const generateMockServer = async (file, options = {}) => {
  try {
    // Validate workspace ID is present
    if (!options.workspaceId) {
      throw new Error("Workspace ID is required for mock server generation");
    }

    // Create a FormData instance to send the file
    const formData = new FormData();
    formData.append("swaggerFile", file);

    // Add options to formData
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    console.log(
      "Sending mock server request with workspace:",
      options.workspaceId
    );

    // Make the API request
    const response = await fetch(
      "http://localhost:3001/api/generate-mock-server",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();

    // Ensure workspace ID is included in the result
    if (result.success && !result.workspaceId) {
      result.workspaceId = options.workspaceId;
    }

    return result;
  } catch (error) {
    console.error("Error generating mock server:", error);
    throw error;
  }
};

export const checkMockServerStatus = async (workspaceId = null) => {
  try {
    // Build URL with optional workspace ID
    let url = "http://localhost:3001/api/mock-server/status";
    if (workspaceId) {
      url += `?workspaceId=${workspaceId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to check server status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking mock server status:", error);
    return { running: false, message: error.message };
  }
};
