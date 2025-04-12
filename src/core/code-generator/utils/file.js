/**
 * File Utilities
 *
 * Utility functions for file operations
 */

const fs = require("fs");
const path = require("path");

/**
 * Validate file paths and ensure directories exist
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {string} outputDir - Output directory
 * @throws {Error} If Swagger file doesn't exist
 */
function validateAndEnsureDirectories(swaggerFilePath, outputDir) {
  if (!fs.existsSync(swaggerFilePath)) {
    throw new Error(`Swagger file not found: ${swaggerFilePath}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
  }
}

/**
 * Write content to a file
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 */
function writeToFile(filePath, content) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Generated file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Read a file
 * @param {string} filePath - File path
 * @returns {string} File content
 * @throws {Error} If file doesn't exist or can't be read
 */
function readFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
}

module.exports = {
  validateAndEnsureDirectories,
  writeToFile,
  readFile,
};
