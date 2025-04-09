// Update src/adapters/codeGeneratorAdapter.js
export const generateCode = async (file, options) => {
  try {
    console.log("Sending request to generate code with options:", options);

    // Validate workspace ID is present
    if (!options.workspaceId) {
      throw new Error("Workspace ID is required for code generation");
    }

    const formData = new FormData();

    // Only append file if it exists
    if (file) {
      formData.append("swaggerFile", file);
    } else {
      // Indicate we want to use the default file
      formData.append("useDefaultFile", "true");
    }

    // Add options to formData EXCEPT workspaceId (we'll put that in URL)
    Object.keys(options).forEach((key) => {
      if (key !== "workspaceId" && key !== "useDefaultFile") {
        formData.append(key, options[key]);
      }
    });

    // Include workspaceId in URL query parameter
    const url = `http://localhost:3001/api/generate-code?workspaceId=${options.workspaceId}`;

    // Log the full request details
    console.log("Sending code generation request to:", url);
    console.log("Using default file:", !file);

    // Send request to API
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

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
