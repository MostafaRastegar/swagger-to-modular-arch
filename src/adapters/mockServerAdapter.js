// dashboard/src/adapters/mockServerAdapter.js
export const generateMockServer = async (file, options = {}) => {
  try {
    // Create a FormData instance to send the file
    const formData = new FormData();
    formData.append("swaggerFile", file);

    // Add any additional options
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

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

    return await response.json();
  } catch (error) {
    console.error("Error generating mock server:", error);
    throw error;
  }
};

export const checkMockServerStatus = async () => {
  try {
    const response = await fetch(
      "http://localhost:3001/api/mock-server/status"
    );

    if (!response.ok) {
      throw new Error(`Failed to check server status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking mock server status:", error);
    return { running: false, message: error.message };
  }
};
