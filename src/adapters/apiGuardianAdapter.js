// Updated src/adapters/apiGuardianAdapter.js
export const compareSpecs = async (oldSpecFile, newSpecFile, options) => {
  try {
    // Validate workspace ID is present
    if (!options.workspaceId) {
      throw new Error("Workspace ID is required for API comparison");
    }

    const formData = new FormData();

    // Only attach files if provided
    if (oldSpecFile) {
      formData.append("oldSpec", oldSpecFile);
    }

    if (newSpecFile) {
      formData.append("newSpec", newSpecFile);
    }

    formData.append("reportLevel", options.reportLevel || "all");
    formData.append("outputFormat", options.outputFormat || "json");

    // Add flags to use default file if needed
    if (options.useDefaultForOld) {
      formData.append("useDefaultForOld", "true");
    }

    if (options.useDefaultForNew) {
      formData.append("useDefaultForNew", "true");
    }

    // Include workspaceId in URL query parameter
    const url = `http://localhost:3001/api/guardian/compare-specs?workspaceId=${options.workspaceId}`;

    console.log("Sending Guardian compare request to:", url);
    console.log("With workspace ID:", options.workspaceId);
    console.log("Use default for old:", options.useDefaultForOld);
    console.log("Use default for new:", options.useDefaultForNew);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

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

export const validateSpecFile = async (file, workspaceId = null) => {
  try {
    const formData = new FormData();
    formData.append("specFile", file);

    // Add workspace ID if provided
    if (workspaceId) {
      formData.append("workspaceId", workspaceId);
    }

    const response = await fetch(
      `http://localhost:3001/api/guardian/validate-spec?workspaceId=${workspaceId}`,
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
