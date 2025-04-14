/**
 * Code Generator
 *
 * Entry point for the TypeScript code generation from Swagger/OpenAPI specifications.
 * This module orchestrates the entire code generation process.
 */

const { validateAndEnsureDirectories } = require("../utils/fileUtils");
const { parseSwaggerFile, extractUniqueTags } = require("./parsers/swagger");
const { extractAllSchemas } = require("./parsers/schema");
const { processTag } = require("./processors");

/**
 * Generate TypeScript modules from a Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {Object} options - Configuration options
 * @param {string} options.outputDir - Output directory for API files
 * @param {string} options.folderStructure - Output directory for folder structure
 * @param {boolean} options.createFolders - Whether to create folder structure
 */
function generateModules(swaggerFilePath, options = {}) {
  const outputDir = options.outputDir || "modules";
  const createFolders = options.createFolders || false;
  const folderStructure = options.folderStructure || "modules";

  console.log("Starting module generation...");
  console.log(`Input: ${swaggerFilePath}`);
  console.log(`Output: ${outputDir}`);

  if (createFolders) {
    console.log(`Creating folder structure in: ${folderStructure}`);
  }

  try {
    // Validate input and ensure directories
    validateAndEnsureDirectories(swaggerFilePath, outputDir);

    // Parse Swagger file
    const swagger = parseSwaggerFile(swaggerFilePath);

    // Extract necessary information
    const tags = extractUniqueTags(swagger);
    console.log(`Found ${tags.length} tags: ${tags.join(", ")}`);

    const allSchemas = extractAllSchemas(swagger);

    // Generate file for each tag with the right options
    tags.forEach((tag) =>
      processTag(tag, swagger, outputDir, allSchemas, {
        createFolders,
        folderStructure,
      })
    );

    console.log("Module generation completed successfully!");
  } catch (error) {
    console.error("Error generating modules:", error);
    console.error(error.stack);
  }
}

module.exports = {
  generateModules,
};
