export const compareSpecs = async (oldSpecFile, newSpecFile, options) => {
  try {
    const formData = new FormData();
    formData.append("oldSpec", oldSpecFile);
    formData.append("newSpec", newSpecFile);
    formData.append("reportLevel", options.reportLevel || "all");
    formData.append("outputFormat", options.outputFormat || "json");

    const response = await fetch(
      "http://localhost:3001/api/guardian/compare-specs",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.report;
  } catch (error) {
    console.error("Error comparing specs:", error);
    throw error;
  }
};

export const validateSpecFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("specFile", file);

    const response = await fetch(
      "http://localhost:3001/api/guardian/validate-spec",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Validation error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error validating spec file:", error);
    throw error;
  }
};
