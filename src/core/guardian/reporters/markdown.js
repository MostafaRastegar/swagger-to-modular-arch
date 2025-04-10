/**
 * Markdown reporter
 *
 * Generates markdown report from API Guardian results
 */

/**
 * Generate a Markdown report
 * @param {Object} report - Report to format
 * @param {string} reportLevel - 'all', 'critical', 'warning', 'info'
 * @returns {string} Markdown report
 */
function generateReport(report, reportLevel = "all") {
  let output = "# API Guardian Breaking Changes Report\n\n";

  // Add summary
  output += "## Summary\n\n";
  output += `- Critical Breaking Changes: ${report.critical.length}\n`;
  output += `- Warnings: ${report.warning.length}\n`;
  output += `- Informational Changes: ${report.info.length}\n\n`;

  // Add critical changes
  if (
    report.critical.length > 0 &&
    (reportLevel === "all" || reportLevel === "critical")
  ) {
    output += "## Critical Breaking Changes\n\n";
    report.critical.forEach((change, index) => {
      output += `### ${index + 1}. ${change.message}\n\n`;
      if (change.impact) output += `**Impact**: ${change.impact}\n\n`;
      if (change.recommendation)
        output += `**Recommendation**: ${change.recommendation}\n\n`;
      output += `**Type**: \`${change.type}\`\n\n`;
      if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
      if (change.method) output += `**Method**: ${change.method}\n\n`;
      output += "---\n\n";
    });
  }

  // Add warnings
  if (
    report.warning.length > 0 &&
    (reportLevel === "all" || reportLevel === "warning")
  ) {
    output += "## Warnings\n\n";
    report.warning.forEach((change, index) => {
      output += `### ${index + 1}. ${change.message}\n\n`;
      if (change.impact) output += `**Impact**: ${change.impact}\n\n`;
      if (change.recommendation)
        output += `**Recommendation**: ${change.recommendation}\n\n`;
      output += `**Type**: \`${change.type}\`\n\n`;
      if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
      if (change.method) output += `**Method**: ${change.method}\n\n`;
      output += "---\n\n";
    });
  }

  // Add info changes
  if (
    report.info.length > 0 &&
    (reportLevel === "all" || reportLevel === "info")
  ) {
    output += "## Informational Changes\n\n";
    report.info.forEach((change, index) => {
      output += `### ${index + 1}. ${change.message}\n\n`;
      output += `**Type**: \`${change.type}\`\n\n`;
      if (change.path) output += `**Path**: \`${change.path}\`\n\n`;
      if (change.method) output += `**Method**: ${change.method}\n\n`;
      output += "---\n\n";
    });
  }

  // Add recommendations
  if (report.suggestions.length > 0) {
    output += "## Recommendations\n\n";
    report.suggestions.forEach((suggestion, index) => {
      output += `### ${suggestion.title}\n\n`;
      output += `${suggestion.description}\n\n`;

      if (suggestion.options && suggestion.options.length > 0) {
        output += "**Options:**\n\n";
        suggestion.options.forEach((option) => {
          output += `- ${option}\n`;
        });
        output += "\n";
      }

      output += "---\n\n";
    });
  }

  return output;
}

module.exports = {
  generateReport,
};
