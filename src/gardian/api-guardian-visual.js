#!/usr/bin/env node

/**
 * API Guardian Visual - API Change Visualization Tool
 *
 * Usage: node api-guardian-visual.js <old-swagger.json> <new-swagger.json>
 *
 * This tool compares two Swagger files and runs a visual dashboard to display changes.
 */
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const APIGuardian = require("./api-guardian");

// Find the project root directory - React project root
const findProjectRoot = (currentDir) => {
  // If we've reached the root of the file system and still haven't found it
  if (currentDir === path.parse(currentDir).root) {
    return process.cwd(); // Return to the current working directory
  }

  // Check for the existence of package.json or public folder
  if (
    fs.existsSync(path.join(currentDir, "package.json")) &&
    fs.existsSync(path.join(currentDir, "public"))
  ) {
    return currentDir;
  }

  // Move up one level
  return findProjectRoot(path.dirname(currentDir));
};

const projectRoot = findProjectRoot(__dirname);

// Parse command-line arguments
const args = process.argv.slice(2);
const oldSpecPath = args[0];
const newSpecPath = args[1];

if (!oldSpecPath || !newSpecPath) {
  console.error(
    "Error: Please provide the paths to the old and new Swagger files."
  );
  console.log(
    "\nUsage: node api-guardian-visual.js <old-swagger.json> <new-swagger.json>"
  );
  process.exit(1);
}

// Check if files exist
if (!fs.existsSync(oldSpecPath)) {
  console.error(`Error: Old specification file not found: ${oldSpecPath}`);
  process.exit(1);
}

if (!fs.existsSync(newSpecPath)) {
  console.error(`Error: New specification file not found: ${newSpecPath}`);
  process.exit(1);
}

console.log("\n API Guardian Visual");
console.log("===========================================");
console.log(`Comparison: ${oldSpecPath} → ${newSpecPath}`);

// Ensure output directory exists
const outputDir = path.join(projectRoot, "public");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Path to JSON report file
const reportPath = path.join(outputDir, "api-guardian-report.json");

// Compare API specifications and generate report
console.log("\n Analyzing API changes...");

try {
  // Create an API Guardian instance
  const guardian = new APIGuardian({
    outputFormat: "json",
  });

  // Compare specifications
  const report = guardian.compareSpecs(oldSpecPath, newSpecPath);

  // Save report
  guardian.generateReport(report, reportPath);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log(" API change analysis completed successfully!");

  // Summary of changes
  console.log("\n Summary of changes:");
  console.log(`  Critical changes: ${report.critical.length}`);
  console.log(`  Warnings: ${report.warning.length}`);
  console.log(`  Informational changes: ${report.info.length}`);

  // Run React application
  console.log("\n Running visual dashboard...");

  const reactApp = spawn("npm", ["start"], {
    stdio: "inherit",
    shell: true,
  });

  reactApp.on("error", (error) => {
    console.error(`Error running dashboard: ${error.message}`);
    console.log("\nTo run the dashboard manually:");
    console.log("1. Ensure all dependencies are installed: npm install");
    console.log("2. Run the application: npm start");
  });
} catch (error) {
  console.error(`\n Error analyzing API: ${error.message}`);
  process.exit(1);
}
