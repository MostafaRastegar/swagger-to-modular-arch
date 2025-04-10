/**
 * Code Generator Main Module
 *
 * Main entry point for the code generator
 */

const path = require("path");
const { validateAndEnsureDirectories } = require("./utils/file");
const { parseSwaggerFile, extractUniqueTags } = require("./parsers/swagger");
const { extractAllSchemas } = require("./parsers/schema");
const { processTag } = require("./processors/tag-processor");
const config = require("./config");

/**
 * Generate TypeScript modules from a Swagger specification
 * @param {string} swaggerFilePath - Path to Swagger JSON file
 * @param {Object} options - Configuration options
 * @param {string} options.outputDir - Output directory for API files
 * @param {string} options.folderStructure - Output directory for folder structure
 * @param {boolean} options.createFolders - Whether to create folder structure
 * @param {boolean} options.verbose - Enable verbose logging
 * @returns {Object} Generation result with stats
 */
function generateModules(swaggerFilePath, options = {}) {
  // Setup configuration with defaults
  const outputDir = options.outputDir || config.DEFAULT_OUTPUT_DIR;
  const createFolders = options.createFolders || false;
  const folderStructure =
    options.folderStructure || config.DEFAULT_FOLDER_STRUCTURE;
  const verbose = options.verbose || config.LOGGING.VERBOSE;

  console.log("Starting module generation...");
  console.log(`Input: ${swaggerFilePath}`);
  console.log(`Output: ${outputDir}`);

  if (createFolders) {
    console.log(`Creating folder structure in: ${folderStructure}`);
  }

  const generationStats = {
    startTime: new Date(),
    endTime: null,
    inputFile: swaggerFilePath,
    outputDir: outputDir,
    tagsProcessed: 0,
    filesGenerated: 0,
    errors: [],
  };

  try {
    // Validate input and ensure directories
    validateAndEnsureDirectories(swaggerFilePath, outputDir);

    // Parse Swagger file
    const swagger = parseSwaggerFile(swaggerFilePath);

    // Extract necessary information
    const tags = extractUniqueTags(swagger);
    console.log(`Found ${tags.length} tags: ${tags.join(", ")}`);

    const allSchemas = extractAllSchemas(swagger);
    generationStats.tagsFound = tags.length;
    generationStats.schemasFound = allSchemas.size;

    // Generate file for each tag with the right options
    for (const tag of tags) {
      try {
        const tagResult = processTag(tag, swagger, outputDir, allSchemas, {
          createFolders,
          folderStructure,
          verbose,
        });

        generationStats.tagsProcessed++;
        generationStats.filesGenerated += tagResult.filesGenerated || 0;
      } catch (tagError) {
        console.error(`Error processing tag ${tag}:`, tagError);
        generationStats.errors.push({
          tag,
          error: tagError.message,
          stack: tagError.stack,
        });
      }
    }

    generationStats.endTime = new Date();
    generationStats.duration =
      generationStats.endTime - generationStats.startTime;

    console.log("Module generation completed successfully!");
    console.log(
      `Generated ${generationStats.filesGenerated} files from ${generationStats.tagsProcessed} tags in ${generationStats.duration}ms`
    );

    return {
      success: true,
      stats: generationStats,
    };
  } catch (error) {
    console.error("Error generating modules:", error);
    console.error(error.stack);

    generationStats.endTime = new Date();
    generationStats.duration =
      generationStats.endTime - generationStats.startTime;
    generationStats.success = false;
    generationStats.error = error.message;

    return {
      success: false,
      stats: generationStats,
      error: error.message,
    };
  }
}

module.exports = {
  generateModules,
};
