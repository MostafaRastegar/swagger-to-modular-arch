// dashboard/src/adapters/codeGeneratorAdapter.js
export const generateCode = async (file, options) => {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    console.log("Sending request to generate code with options:", options);

    const formData = new FormData();
    formData.append("swaggerFile", file);

    // افزودن options به formData
    Object.keys(options).forEach((key) => {
      formData.append(key, options[key]);
    });

    // درخواست به API
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
    console.log("Received response:", result);

    return result;
  } catch (error) {
    console.error("Error in generateCode adapter:", error);
    throw error;
  }
};

// اضافه کردن متد تست اتصال
export const testApiConnection = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/status");
    return await response.json();
  } catch (error) {
    console.error("API connection test failed:", error);
    throw error;
  }
};
