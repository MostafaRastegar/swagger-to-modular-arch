/**
 * JSON reporter
 *
 * Generates JSON report from API Guardian results
 */

/**
 * Generate a JSON report
 * @param {Object} report - Report to format
 * @param {string} reportLevel - 'all', 'critical', 'warning', 'info'
 * @returns {string} JSON report
 */
function generateReport(report, reportLevel = "all") {
  // Filter report items based on level
  const filteredReport = { ...report };

  if (reportLevel !== "all") {
    // Filter based on reportLevel - 'critical', 'warning', 'info'
    if (reportLevel === "critical") {
      filteredReport.warning = [];
      filteredReport.info = [];
    } else if (reportLevel === "warning") {
      filteredReport.info = [];
    }
  }

  // Add metadata
  filteredReport.metadata = {
    generatedAt: new Date().toISOString(),
    reportLevel,
    totalCritical: report.critical.length,
    totalWarnings: report.warning.length,
    totalInfo: report.info.length,
    totalSuggestions: report.suggestions.length,
  };

  return JSON.stringify(filteredReport, null, 2);
}

module.exports = {
  generateReport,
};
