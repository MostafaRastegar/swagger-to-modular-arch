// src/adapters/codeGeneratorAdapter.js

export const generateCode = async (file, options) => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    console.log("Sending request to generate code with options:", options);

    // Validate workspace ID is present
    if (!options.workspaceId) {
      throw new Error("Workspace ID is required for code generation");
    }

    const formData = new FormData();
    formData.append("swaggerFile", file);

    // Add options to formData
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    // Log the full request details
    console.log(
      "Sending code generation request with workspace:",
      options.workspaceId
    );

    // Send request to API
    const response = await fetch("http://localhost:3001/api/generate-code", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Received code generation response:", result);

    // Ensure workspace ID is included in the result
    if (result.success && !result.workspaceId) {
      result.workspaceId = options.workspaceId;
    }

    return result;
  } catch (error) {
    console.error("Error in generateCode adapter:", error);
    throw error;
  }
};

// Update test API connection to include workspace info
export const testApiConnection = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/status");
    return await response.json();
  } catch (error) {
    console.error("API connection test failed:", error);
    throw error;
  }
};
