// dashboard/src/adapters/apiGuardianAdapter.js
export const compareSpecs = async (oldSpecFile, newSpecFile, options) => {
  try {
    const formData = new FormData();
    formData.append("oldSpec", oldSpecFile);
    formData.append("newSpec", newSpecFile);
    formData.append("reportLevel", options.reportLevel || "all");
    formData.append("outputFormat", options.outputFormat || "json");

    const response = await fetch("http://localhost:3001/api/compare-specs", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.report;
  } catch (error) {
    console.error("Error comparing specs:", error);
    throw error;
  }
};
