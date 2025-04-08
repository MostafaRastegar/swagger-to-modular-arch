// src/adapters/apiGuardianAdapter.js

export const compareSpecs = async (oldSpecFile, newSpecFile, options) => {
  try {
    // Validate workspace ID is present
    if (!options.workspaceId) {
      throw new Error("Workspace ID is required for API comparison");
    }

    const formData = new FormData();
    formData.append("oldSpec", oldSpecFile);
    formData.append("newSpec", newSpecFile);
    formData.append("reportLevel", options.reportLevel || "all");
    formData.append("outputFormat", options.outputFormat || "json");
    formData.append("workspaceId", options.workspaceId);

    console.log(
      "Sending Guardian compare request with workspace:",
      options.workspaceId
    );

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

    // Ensure workspace ID is included in the report
    if (result.report && !result.report.workspaceId) {
      result.report.workspaceId = options.workspaceId;
    }

    return result.report;
  } catch (error) {
    console.error("Error comparing specs:", error);
    throw error;
  }
};

export const validateSpecFile = async (file, workspaceId = null) => {
  try {
    const formData = new FormData();
    formData.append("specFile", file);

    // Add workspace ID if provided
    if (workspaceId) {
      formData.append("workspaceId", workspaceId);
    }

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
