// File operations utility functions
const fs = require("fs");
const path = require("path");

/**
 * Validate file paths and ensure directories exist
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {string} outputDir - Output directory
 */
function validateAndEnsureDirectories(swaggerFilePath, outputDir) {
  if (!fs.existsSync(swaggerFilePath)) {
    throw new Error(`Swagger file not found: ${swaggerFilePath}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
}

/**
 * Write content to a file
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 */
function writeToFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`===========================Generated file: ${filePath}`);
}

module.exports = {
  validateAndEnsureDirectories,
  writeToFile,
};
