#!/usr/bin/env node

/**
 * API Guardian CLI
 *
 * Command-line interface for the API Guardian breaking change detector
 */
const fs = require("fs");
const path = require("path");
const APIGuardian = require("./api-guardian");

/**
 * Show CLI usage info
 */
function showUsage() {
  console.log("\nAPI Guardian - Breaking Changes Detector");
  console.log("----------------------------------------");
  console.log(
    "Usage: node api-guardian-cli.js <old-swagger.json> <new-swagger.json> [options]"
  );
  console.log("\nOptions:");
  console.log(
    "  --output=<file>     Output file for the report (default: api-guardian-report.md)"
  );
  console.log(
    "  --format=<format>   Output format: markdown or json (default: markdown)"
  );
  console.log(
    "  --level=<level>     Report level: all, critical, warning, info (default: all)"
  );
  console.log(
    "  --ci                CI mode: exit with error code if critical changes detected"
  );
  console.log("  --help              Show this help message");
  console.log("\nExample:");
  console.log(
    "  node api-guardian-cli.js old-swagger.json new-swagger.json --output=report.md --format=markdown --level=all"
  );
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    oldSpecPath: null,
    newSpecPath: null,
    outputPath: "api-guardian-report.md",
    outputFormat: "markdown",
    reportLevel: "all",
    ciMode: false,
    showHelp: false,
  };

  // Handle positional arguments
  if (args.length > 0 && !args[0].startsWith("--")) {
    result.oldSpecPath = args[0];
  }

  if (args.length > 1 && !args[1].startsWith("--")) {
    result.newSpecPath = args[1];
  }

  // Handle options
  args.forEach((arg) => {
    if (arg === "--help") {
      result.showHelp = true;
    } else if (arg === "--ci") {
      result.ciMode = true;
    } else if (arg.startsWith("--output=")) {
      result.outputPath = arg.split("=")[1];
    } else if (arg.startsWith("--format=")) {
      const format = arg.split("=")[1];
      if (["markdown", "json"].includes(format)) {
        result.outputFormat = format;
      } else {
        console.error(`Invalid format: ${format}. Using default: markdown`);
      }
    } else if (arg.startsWith("--level=")) {
      const level = arg.split("=")[1];
      if (["all", "critical", "warning", "info"].includes(level)) {
        result.reportLevel = level;
      } else {
        console.error(`Invalid report level: ${level}. Using default: all`);
      }
    }
  });

  return result;
}

/**
 * Main function
 */
function main() {
  const args = parseArgs();

  if (args.showHelp) {
    showUsage();
    process.exit(0);
  }

  if (!args.oldSpecPath || !args.newSpecPath) {
    console.error("Error: Missing required arguments.");
    showUsage();
    process.exit(1);
  }

  try {
    // Check if spec files exist
    if (!fs.existsSync(args.oldSpecPath)) {
      console.error(`Error: Old spec file not found: ${args.oldSpecPath}`);
      process.exit(1);
    }

    if (!fs.existsSync(args.newSpecPath)) {
      console.error(`Error: New spec file not found: ${args.newSpecPath}`);
      process.exit(1);
    }

    console.log(`\nAPI Guardian - Detecting Breaking Changes`);
    console.log(`Old Spec: ${args.oldSpecPath}`);
    console.log(`New Spec: ${args.newSpecPath}`);

    // Initialize API Guardian
    const guardian = new APIGuardian({
      reportLevel: args.reportLevel,
      outputFormat: args.outputFormat,
    });

    // Compare specs
    const report = guardian.compareSpecs(args.oldSpecPath, args.newSpecPath);

    // Generate and save report
    guardian.generateReport(report, args.outputPath);

    // Exit with error code in CI mode if critical changes detected
    if (args.ciMode && guardian.hasCriticalChanges(report)) {
      console.error(
        "\nExiting with error code due to critical breaking changes."
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exit(1);
  }
}

// Run the CLI
main();
