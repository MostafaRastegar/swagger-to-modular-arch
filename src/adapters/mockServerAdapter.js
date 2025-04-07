// dashboard/src/adapters/mockServerAdapter.js
export const generateMockServer = async (file, options) => {
  try {
    const formData = new FormData();
    formData.append("swaggerFile", file);

    const response = await fetch(
      "http://localhost:3001/api/generate-mock-server",
      {
        method: "POST",
        body: formData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error generating mock server:", error);
    throw error;
  }
};
