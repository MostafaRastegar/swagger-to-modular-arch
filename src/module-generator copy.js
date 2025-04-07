// Module generator that combines all components
const path = require("path");
const { validateAndEnsureDirectories } = require("./utils/fileUtils");
const {
  parseSwaggerFile,
  extractUniqueTags,
} = require("./parsers/swaggerParser");
const { extractAllSchemas } = require("./parsers/schemaParser");
const { processTag } = require("./processors/tagProcessor");
const { generateFolderStructure } = require("./utils/folderStructureGenerator");

/**
 * Generate typescript modules from a Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {Object} options - Configuration options
 * @param {string} options.outputDir - Output directory for API files
 * @param {string} options.folderStructure - Output directory for folder structure
 * @param {boolean} options.createFolders - Whether to create folder structure
 */
function generateModules(swaggerFilePath, options = {}) {
  const outputDir = options.outputDir || "src/modules";
  const createFolders = options.createFolders || false;
  const folderStructure = options.folderStructure || "modules";

  console.log("Starting module generation...");
  console.log(`Input: ${swaggerFilePath}`);
  console.log(`Output: ${outputDir}`);

  try {
    // Validate input and ensure directories
    validateAndEnsureDirectories(swaggerFilePath, outputDir);

    // Parse Swagger file
    const swagger = parseSwaggerFile(swaggerFilePath);

    // Create folder structure if requested
    if (createFolders) {
      console.log(`Creating folder structure in: ${folderStructure}`);
      generateFolderStructure(swagger, folderStructure);
    }

    // Extract necessary information
    const tags = extractUniqueTags(swagger);
    console.log(`Found ${tags.length} tags: ${tags.join(", ")}`);

    const allSchemas = extractAllSchemas(swagger);

    // Generate file for each tag
    tags.forEach((tag) => processTag(tag, swagger, outputDir, allSchemas));

    console.log("Module generation completed successfully!");
  } catch (error) {
    console.error("Error generating modules:", error);
    console.error(error.stack);
  }
}

module.exports = {
  generateModules,
};
