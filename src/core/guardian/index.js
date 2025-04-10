/**
 * API Guardian - Breaking Changes Detector
 *
 * Main module that orchestrates API specification comparison and report generation
 */
const fs = require("fs");
const path = require("path");
const detector = require("./detector");
const markdownReporter = require("./reporters/markdown");
const jsonReporter = require("./reporters/json");
const { parseSwaggerFile } = require("../code-generator/parsers");

/**
 * API Guardian class for detecting breaking changes between API specifications
 */
class APIGuardian {
  /**
   * Create a new API Guardian instance
   * @param {Object} options - Configuration options
   * @param {string} options.reportLevel - 'all', 'critical', 'warning', 'info'
   * @param {string} options.outputFormat - 'markdown', 'json'
   */
  constructor(options = {}) {
    this.options = {
      reportLevel: "all", // 'all', 'critical', 'warning', 'info'
      outputFormat: "markdown", // 'markdown', 'json'
      ...options,
    };
  }

  /**
   * Compare two API specifications for breaking changes
   * @param {string} oldSpecPath - Path to the old API spec
   * @param {string} newSpecPath - Path to the new API spec
   * @returns {Object} Report of breaking changes
   */
  compareSpecs(oldSpecPath, newSpecPath) {
    console.log(`Comparing API specifications:`);
    console.log(`  Old: ${oldSpecPath}`);
    console.log(`  New: ${newSpecPath}`);

    // Parse specifications
    const oldSpec = parseSwaggerFile(oldSpecPath);
    const newSpec = parseSwaggerFile(newSpecPath);

    // Detect breaking changes
    const report = detector.detectBreakingChanges(oldSpec, newSpec);

    // Generate summary
    this.generateSummary(report);

    return report;
  }

  /**
   * Generate a summary of breaking changes
   * @param {Object} report - Report to summarize
   */
  generateSummary(report) {
    const criticalCount = report.critical.length;
    const warningCount = report.warning.length;
    const infoCount = report.info.length;

    console.log("\n===== API Guardian Report Summary =====");
    console.log(`Critical Breaking Changes: ${criticalCount}`);
    console.log(`Warnings: ${warningCount}`);
    console.log(`Info: ${infoCount}`);

    if (criticalCount > 0) {
      console.log(
        "\nCritical breaking changes detected! These changes will likely break existing clients."
      );
    } else if (warningCount > 0) {
      console.log(
        "\nPotential compatibility issues detected. Review warnings to ensure backward compatibility."
      );
    } else {
      console.log(
        "\nNo breaking changes detected. API changes appear to be backward compatible."
      );
    }

    if (report.suggestions.length > 0) {
      console.log("\nRecommendations available in the full report.");
    }
  }

  /**
   * Generate a detailed report in the specified format
   * @param {Object} report - Report to format
   * @param {string} outputPath - Path to save the report (optional)
   * @returns {string} Formatted report
   */
  generateReport(report, outputPath = null) {
    let formattedReport = "";

    if (this.options.outputFormat === "markdown") {
      formattedReport = markdownReporter.generateReport(
        report,
        this.options.reportLevel
      );
    } else if (this.options.outputFormat === "json") {
      formattedReport = jsonReporter.generateReport(
        report,
        this.options.reportLevel
      );
    }

    if (outputPath) {
      fs.writeFileSync(outputPath, formattedReport);
      console.log(`Report saved to ${outputPath}`);
    }

    return formattedReport;
  }

  /**
   * Check if there are any critical breaking changes
   * @param {Object} report - Report to check
   * @returns {boolean} True if critical changes exist
   */
  hasCriticalChanges(report) {
    return report.critical.length > 0;
  }
}

module.exports = APIGuardian;
